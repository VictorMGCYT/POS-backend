import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sales } from './entities/sale.entity';

@Module({
  controllers: [SalesController],
  providers: [SalesService],
  imports: [
    TypeOrmModule.forFeature([Sales])
  ]
})
export class SalesModule {}
