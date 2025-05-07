import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Products } from './entities/product.entity';
import { Not, Repository } from 'typeorm';
import { PaginationDto } from 'src/auth/dto/pagination.dto';

@Injectable()
export class ProductsService {

  constructor(
    @InjectRepository(Products)
    private readonly productsRepository: Repository<Products>
  ){}

  // ** Creación de un nuevo producto en la base de datos
  async create(createProductDto: CreateProductDto): Promise<string | Products> {

    const product = this.productsRepository.create(createProductDto);

    try {
      await this.productsRepository.save(product)
      return product;
    } catch (error) {
      return this.handleError(error);
    }

  }

  // ** Busqueda y pagonación de los productos
  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0} = paginationDto;
    const [products, total] = await this.productsRepository.findAndCount({
      skip: offset,
      take: limit
    })

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

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
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
