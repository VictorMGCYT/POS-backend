import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sales } from './entities/sale.entity';
import { SaleItemsModule } from 'src/sale-items/sale-items.module';
import { ProductsModule } from 'src/products/products.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [SalesController],
  providers: [SalesService],
  imports: [
    TypeOrmModule.forFeature([Sales]),

    SaleItemsModule,

    ProductsModule,

    AuthModule
  ],
  exports: [SalesService]
})
export class SalesModule {}
