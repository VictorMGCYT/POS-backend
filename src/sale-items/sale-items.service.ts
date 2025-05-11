import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSaleItemDto } from './dto/create-sale-item.dto';
import { UpdateSaleItemDto } from './dto/update-sale-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SaleItems } from './entities/sale-item.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SaleItemsService {

  constructor(
    @InjectRepository(SaleItems)
    private readonly saleItemsRepository: Repository<SaleItems>
  ){}

  async findBySaleId(id: string) {

    const queryBuilder = await this.saleItemsRepository.createQueryBuilder('saleItems');
    const [saleItems, total] = await queryBuilder.leftJoinAndSelect('saleItems.product', 'product')
      .where('saleItems.saleId = :id', { id })
      .select([
        'saleItems.id',
        'saleItems.saleId',
        'saleItems.quantity',
        'saleItems.unitPrice',
        'saleItems.purchasePrice',
        'saleItems.subtotal',
        'saleItems.profit',
        'product.name',
        'product.skuCode'
      ])
      .getManyAndCount();
    

    if(total === 0) throw new NotFoundException('Sale not found');

    return {
      total,
      saleItems
    };
  }

}
