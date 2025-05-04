import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Products } from './entities/product.entity';
import { Repository } from 'typeorm';

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

  findAll() {
    return `This action returns all products`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
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
