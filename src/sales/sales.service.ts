import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Sales } from './entities/sale.entity';
import { DataSource, Repository } from 'typeorm';
import { SaleItems } from 'src/sale-items/entities/sale-item.entity';
import { Products } from 'src/products/entities/product.entity';
import { Users } from 'src/auth/entities/auth.entity';

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

  async create(createSaleDto: CreateSaleDto) {

    const queryRunner = this.dataSource.createQueryRunner();
    queryRunner.startTransaction();

    try {
      
      const {saleItems, userId, paymentMethod} = createSaleDto;
      const user = await queryRunner.manager.findOneBy(Users, {id: userId});
     //Si no existe el usuario, lanzamos la excepción
      if(!user) {
        throw new BadRequestException('User not found');
      }
      
      console.log(saleItems);

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
