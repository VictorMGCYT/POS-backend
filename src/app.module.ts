import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesModule } from './sales/sales.module';
import { ProductsModule } from './products/products.module';
import { SaleItemsModule } from './sale-items/sale-items.module';
import { ReportsModule } from './reports/reports.module';
import { PrinterModule } from './printer/printer.module';

@Module({
  imports: [
    
    ConfigModule.forRoot(),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) ?? 5435,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,  
    }),
    
    
    AuthModule,
    
    
    SalesModule,
    
    
    ProductsModule,
    
    
    SaleItemsModule,
    
    
    ReportsModule,
    
    
    PrinterModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
