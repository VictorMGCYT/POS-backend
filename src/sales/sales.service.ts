import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Sales } from './entities/sale.entity';
import { DataSource, In, Repository } from 'typeorm';
import { SaleItems } from 'src/sale-items/entities/sale-item.entity';
import { Products } from 'src/products/entities/product.entity';
import { Users } from 'src/auth/entities/auth.entity';
import Decimal from 'decimal.js';

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
      await queryRunner.manager.save(SaleItems, productsSalesWithSaleId);
      await queryRunner.commitTransaction();

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
      
    }

  }

  findAll() {
    return `This action returns all sales`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sale`;
  }

  update(id: number, updateSaleDto: UpdateSaleDto) {
    return `This action updates a #${id} sale`;
  }

  remove(id: number) {
    return `This action removes a #${id} sale`;
  }
}
