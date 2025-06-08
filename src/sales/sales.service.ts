import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Sales } from './entities/sale.entity';
import { DataSource, In, Repository } from 'typeorm';
import { SaleItems } from 'src/sale-items/entities/sale-item.entity';
import { Products } from 'src/products/entities/product.entity';
import { Users } from 'src/auth/entities/auth.entity';
import Decimal from 'decimal.js';
import { PaginationDtoSales } from './dto/paginatio-dto-sale';

@Injectable()
export class SalesService {

  constructor(
    @InjectRepository(Sales)
    private readonly salesRepository: Repository<Sales>,
    @InjectRepository(SaleItems)
    private readonly saleItemsRepository: Repository<SaleItems>,
    @InjectRepository(Products)
    private readonly productsRepository: Repository<Products>,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,

    private readonly dataSource: DataSource
  ){}

  // ** Crear la venta y además la relación con los productos vendidos
  // ** Se hace mediante un queryRunner para que se pueda hacer un rollback en caso de error
  async create(createSaleDto: CreateSaleDto) {

    const queryRunner = this.dataSource.createQueryRunner();
    queryRunner.startTransaction();

    try {
      
      const {saleItems, userId, paymentMethod} = createSaleDto;
      const user = await queryRunner.manager.findOneBy(Users, {id: userId});

      if(!user) {
        throw new BadRequestException('User not found');
      }

      // Obtnemos la información de los productos que se vendieron
      const products = await queryRunner.manager.find(
        Products, 
        {
          where: {
            id: In(saleItems.map(item => item.productId))
          }
        }
      )

      if(products.length === 0) throw new BadRequestException('Sale must have at least one product');

      products.forEach( product => {
        const saleItem = saleItems.find(item => item.productId === product.id);
        if (!saleItem) return; // por si acaso

        const quantity = new Decimal(saleItem.quantity);
        const stockQuantity = new Decimal(product.stockQuantity);

        if (quantity.greaterThan(stockQuantity)) {
          throw new BadRequestException(`La cantidad de ${product.name} es mayor al stock`);
        }
      })

      // Hacemos las cuenas de los productos que se vendieron y el total de cada uno
      const productsSales = products.map( (product, index) => {

        // Filtamos el producto vendido por el id del producto sacado de la base de datos
        const productUpdate = saleItems.filter( item => item.productId === product.id);

        const totalPrice = new Decimal(product.unitPrice).times(productUpdate[0].quantity);
        const quantity = new Decimal(productUpdate[0].quantity);
        const purchasePrice = new Decimal(product.purchasePrice);
        
        const profit = totalPrice.minus(quantity.times(purchasePrice)).toFixed(2);

        return {
          productId: product.id,
          quantity: productUpdate[0].quantity,
          unitPrice: product.unitPrice,
          purchasePrice: product.purchasePrice,
          subtotal: totalPrice.toFixed(2),
          profit: profit,
        }
      })

      // Mediante los productos vendidos sacamos el total de la venta
      const totalAmount = productsSales.reduce((acc, item) => {
        return acc.plus(item.subtotal);
      }, new Decimal(0));
      const totalFormatted = totalAmount.toFixed(2);
      const totalProfit = productsSales.reduce((acc, item) => {
        return acc.plus(item.profit)
      }, new Decimal(0))
      const totalProfitFormatted = totalProfit.toFixed(2);

      // Creamos la venta para guardar en la base de datos
      const saleTotal = {
        userId: userId,
        totalAmount: totalFormatted,
        totalProfit: totalProfitFormatted,
        paymentMethod: paymentMethod,
      }

      const sale = await queryRunner.manager.save(Sales, saleTotal);
      const productsSalesWithSaleId = productsSales.map( product => {
        return {
          ...product,
          saleId: sale.id
        }
      });

      // Actualizamos el stock de los productos vendidos
      const updatedProducts = products.map(product => {
        const saleItem = saleItems.find(item => item.productId === product.id);
      
        if (!saleItem) return product; // por si acaso
      
        const newStock = new Decimal(product.stockQuantity).minus(saleItem.quantity);
      
        return {
          ...product,
          stockQuantity: newStock.toFixed(2), // Actualizamos el stock del producto
        };
      });
      
      await queryRunner.manager.save(Products, updatedProducts);
      await queryRunner.manager.save(SaleItems, productsSalesWithSaleId);
      await queryRunner.commitTransaction();

      return sale;

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
      
    }

  }

  // ** Listar todas las ventas de la base de datos
  async findAll(paginationDtoSale: PaginationDtoSales) {
    const { limit = 50, offset = 0, endDate, startDate} = paginationDtoSale;
    const today = new Date();
    const startOfDay = startDate;
    const endOfDay = endDate;

    const [sales, total] = await this.salesRepository
      .createQueryBuilder('sale')
      .leftJoinAndSelect('sale.user', 'user')
      .select([
        'sale.id',
        'sale.totalAmount',
        'sale.totalProfit',
        'sale.paymentMethod',
        'sale.saleDate',
        'user.id',
        'user.username',
        'user.role'
      ])
      .where("sale.saleDate BETWEEN :start AND :end", {
        start: startOfDay,
        end: endOfDay,
      })
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    const resul = await this.salesRepository.createQueryBuilder('sale')
      .select('COUNT(sale.id)', 'totalSales')
      .addSelect("SUM(sale.totalAmount)", "totalAmount")
      .addSelect("SUM(sale.totalProfit)", "totalProfit")
      .addSelect(
        `SUM(CASE WHEN sale.paymentMethod = 'Efectivo' THEN sale.totalAmount ELSE 0 END)`,
        "totalCash"
      )
      .addSelect(
        `SUM(CASE WHEN sale.paymentMethod = 'Tarjeta' THEN sale.totalAmount ELSE 0 END)`,
        "totalCard"
      )
      .addSelect(
        `COUNT(CASE WHEN sale.paymentMethod = 'Efectivo' THEN 1 END)`,
        "totalSalesCash"
      )
      .addSelect(
        `COUNT(CASE WHEN sale.paymentMethod = 'Tarjeta' THEN 1 END)`,
        "totalSalesCard"
      )
      .where("sale.saleDate BETWEEN :start AND :end", {
        start: startOfDay,
        end: endOfDay,
      })
      .getRawOne();

    if(sales.length === 0) throw new NotFoundException('No sales found');

    const currentPage = Math.floor(offset / limit) + 1;
    const totalPages = Math.ceil(total / limit);

    return {
      totalItems: total,
      currentPage,
      totalPages,
      itemsPerPage: limit,
      resul,
      sales,
    };
  }

  // ** Encontrar una venta por su ID
  async findOne(id: string) {

    const sale = await this.salesRepository.findOneBy({id});

    if(!sale) {
      throw new NotFoundException('Sale not found');
    }

    return sale;
  }

}
