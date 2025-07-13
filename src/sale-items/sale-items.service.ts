import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSaleItemDto } from './dto/create-sale-item.dto';
import { UpdateSaleItemDto } from './dto/update-sale-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SaleItems } from './entities/sale-item.entity';
import { Repository } from 'typeorm';
import { BestProductsDto } from './dto/best-products.dto';
import { BestProductResultDto } from './dto/best-products-result.dto';
import { WorstProductsDto } from './dto/worst-products';
import { WorstProductResultDto } from './dto/worst-products-result.dto';

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

  async findBestProducts(bestProductsDto: BestProductsDto) {

    const { dayStart, dayEnd } = bestProductsDto;

    const queryBuilder = this.saleItemsRepository.createQueryBuilder('saleItems');
    const bestProducts = queryBuilder
      .leftJoin('saleItems.product', 'product')
      .select([
        'saleItems.productId',
        'product.name',
        'SUM(saleItems.quantity) AS totalQuantity',
        'SUM(saleItems.subtotal) AS totalSales',
        'SUM(saleItems.profit) AS totalProfit'
      ])
      .where('saleItems.createAt BETWEEN :dayStart AND :dayEnd', {
        dayStart: dayStart.toISOString(),
        dayEnd: dayEnd.toISOString()
      })
      .groupBy('saleItems.productId, product.name')
      .orderBy('totalQuantity', 'DESC')
      .limit(50)

    console.log(bestProducts.getQuery());

    const products: BestProductResultDto[] = await bestProducts.getRawMany();

    return products;
  }

  async findWorstProducts(worstProductsDto: WorstProductsDto){
    const { dayStart, dayEnd } = worstProductsDto;

    const queryBuilder = this.saleItemsRepository.createQueryBuilder('saleItems');
    const bestProducts = queryBuilder
      .leftJoin('saleItems.product', 'product')
      .select([
        'saleItems.productId',
        'product.name',
        'SUM(saleItems.quantity) AS totalQuantity',
        'SUM(saleItems.subtotal) AS totalSales',
        'SUM(saleItems.profit) AS totalProfit'
      ])
      .where('saleItems.createAt BETWEEN :dayStart AND :dayEnd', {
        dayStart: dayStart.toISOString(),
        dayEnd: dayEnd.toISOString()
      })
      .groupBy('saleItems.productId, product.name')
      .orderBy('totalQuantity', 'ASC')
      .limit(50)

    console.log(bestProducts.getQuery());

    const products: WorstProductResultDto[] = await bestProducts.getRawMany();

    return products;
  }


}
