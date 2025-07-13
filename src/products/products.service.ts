import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Products } from './entities/product.entity';
import { Not, Repository } from 'typeorm';
import { FilterProductsDto } from './dto/filter-products.dto';
import { NoSalesProductsDto } from './dto/no-sales-products.dto';
import { NoSaleProductResultDto } from './dto/no-sales-products-result.dto';

@Injectable()
export class ProductsService {

  constructor(
    @InjectRepository(Products)
    private readonly productsRepository: Repository<Products>
  ){}

  // ** Creación de un nuevo producto en la base de datos
  async create(createProductDto: CreateProductDto): Promise<string | Products> {

    // Primero revisamos si el producto ya existe en la base de datos
    const { skuCode } = createProductDto;
    const productExist = await this.productsRepository.findOne({
      where: {skuCode: skuCode},
      withDeleted: true
    });
    
    if (productExist) {
      if(!productExist.deletedAt){
        throw new BadRequestException(`El producto con el skuCode ${skuCode} ya existe`);
      } else{
        // Si el producto existe pero está eliminado, lo restauramos
        await this.productsRepository.restore(productExist.id);

        const updateProductExist = this.productsRepository.merge(productExist, createProductDto);
        updateProductExist.deletedAt = null;
        await this.productsRepository.save(updateProductExist);

        return updateProductExist;
      }

    }

    // Si el producto no existe, lo creamos
    const product = this.productsRepository.create(createProductDto);

    try {
      await this.productsRepository.save(product)
      return product;
    } catch (error) {
      return this.handleError(error);
    }

  }

  // ** Busqueda y paginación de los productos
  async findAll(filterProductsDto: FilterProductsDto) {
    const { orderProducts, productsTipe, search, stockOrder, limit = 50, offset = 0 } = filterProductsDto;

    const query = this.productsRepository.createQueryBuilder('product');

    // Filtro por tipo de producto
    if (productsTipe && productsTipe !== 'all') {
      const isByWeight = productsTipe === 'weight' ? true : false
      query.andWhere('product.isByWeight = :isByWeight', { isByWeight: isByWeight });
    }

    // Búsqueda por nombre
    if (search) {
      query.andWhere('LOWER(product.name) LIKE LOWER(:search) OR LOWER(product.skuCode) LIKE LOWER(:search)', {
        search: `%${search}%`,
      });
    }

    // Ordenamiento por nombre (alfabético)
    if (orderProducts) {
      query.orderBy('product.name', orderProducts.toUpperCase() as 'ASC' | 'DESC');
    }

    // Ordenamiento adicional por stock si se solicita
    if (stockOrder) {
      if (!orderProducts) {
        query.orderBy('product.stockQuantity', stockOrder.toUpperCase() as 'ASC' | 'DESC');
      } else {
        query.orderBy('product.stockQuantity', stockOrder.toUpperCase() as 'ASC' | 'DESC');
      }
    }

    // Paginación
    query.skip(offset).take(limit);
    const [products, total] = await query.getManyAndCount();

    if(!products) throw new NotFoundException('Products not found');

    // Crear paginaciones para la respuesta
    const currentPage = Math.floor(offset / limit) + 1;
    const totalPages = Math.ceil(total / limit);

    return {
      totalProducts: total,
      currentPage,
      totalPages,
      productsPerPage: limit,
      products
    }
  }

  // ** Busqueda de un producto por su id
  async findOne(id: string) {

    const product = await this.productsRepository.findOneBy({id});
    if(!product) throw new NotFoundException('Product not found');

    return product;
  }

  // ** Actualización de un producto por su id
  async update(id: string, updateProductDto: UpdateProductDto) {

    const product = await this.findOne(id);
    const productUpdate = this.productsRepository.merge(product, updateProductDto);
    try {
      await this.productsRepository.save(productUpdate);
    } catch (error) {
      return this.handleError(error);
    }

    return productUpdate;
  }

  // ** Eliminación de un producto por su id
  async remove(id: string) {
    const product = await this.findOne(id);
    
    await this.productsRepository.softDelete(id);

    return {
      message: `El producto ${product.name} ha sido eliminado`,
    };
  }

  // ** consulta para obtener los productos sin ventas:
  async findNoSalesProducts(noSalesProducts: NoSalesProductsDto) {
    const {dayEnd, dayStart} = noSalesProducts;

    const queryBuilder = this.productsRepository.createQueryBuilder('prod');

    const products: NoSaleProductResultDto[] = await queryBuilder
      .select([
        'prod.id', 
        'prod.name',
        'prod.stockQuantity',
        'prod.purchasePrice',
        'prod.unitPrice'
      ])
      .where(qb => {
        const subQuery = qb
          .subQuery()
          .select('si.productId')
          .from('sale_items', 'si')
          .where('si.createAt BETWEEN :dayStart AND :dayEnd')
          .getQuery();
        return 'prod.id NOT IN ' + subQuery;
      })
      .orderBy('prod.stockQuantity')
      .setParameter('dayStart', dayStart.toISOString())
      .setParameter('dayEnd', dayEnd.toISOString())
      .getRawMany();

    return products;

  }

  // ** Método para obtener el stock de los productos
  async findStockProducts(){

    const products = await this.productsRepository.find({
      select: ['name', 'skuCode', 'stockQuantity', 'purchasePrice', 'unitPrice'],
      order: {
        stockQuantity: "DESC"
      }
    });
    return products;

  }

  // ** Manejo de errores genericos
  private handleError(error: any){
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    } else if (error.code === '23503') {
      return 'User not found';
    } else {
      throw new InternalServerErrorException(error.detail);
    }
  }
}
