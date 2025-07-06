import { Module } from '@nestjs/common';
import { SaleItemsService } from './sale-items.service';
import { SaleItemsController } from './sale-items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SaleItems } from './entities/sale-item.entity';

@Module({
  controllers: [SaleItemsController],
  providers: [SaleItemsService],
  imports: [
    TypeOrmModule.forFeature([SaleItems])
  ],
  exports: [TypeOrmModule, SaleItemsService]
})
export class SaleItemsModule {}
