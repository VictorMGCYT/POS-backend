import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { PrinterModule } from 'src/printer/printer.module';
import { SaleItemsModule } from 'src/sale-items/sale-items.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ReportsController],
  providers: [ReportsService],
  imports: [PrinterModule, SaleItemsModule, AuthModule]
})
export class ReportsModule {}
