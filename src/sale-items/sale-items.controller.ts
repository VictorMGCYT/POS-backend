import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { SaleItemsService } from './sale-items.service';
import { CreateSaleItemDto } from './dto/create-sale-item.dto';
import { UpdateSaleItemDto } from './dto/update-sale-item.dto';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { BestProductsDto } from './dto/best-products.dto';

@Controller('sale-items')
export class SaleItemsController {
  constructor(private readonly saleItemsService: SaleItemsService) {}

  @Get('sale-item/:id')
  @ApiOperation({ summary: 'Obtener items vendidos', description: 'Detalles de todos los items vendidos en una venta' })
  @ApiResponse({ status: 200, description: 'Items de venta obtenidos exitosamente' })
  @ApiResponse({ status: 404, description: 'Items de venta no encontrados'})
  @ApiParam({ 
    name: 'id',
    description: 'ID de la venta para obtener sus items',
    type: String,
    example: 'bda4f20a-c044-494e-b172-7f9a17562478'
  })
  findBySaleId(@Param('id', ParseUUIDPipe) id: string) {
    return this.saleItemsService.findBySaleId(id);
  }

  @Get('best-products')
  @ApiOperation({ summary: 'Obtener los 50 productos más vendidos', description: 'Obtiene los 50 productos más vendidos en la tienda' })
  @ApiResponse({ status: 200, description: 'Productos más vendidos obtenidos exitosamente' })
  @ApiQuery({
    name: 'dayStart',
    type: Date,
    description: 'Fecha de inicio del periodo para obtener los productos más vendidos',
    example: '2025-07-01T06:00:00.000Z' 
  })
  @ApiQuery({
    name: 'dayEnd',
    type: Date,
    description: 'Fecha de fin del periodo para obtener los productos más vendidos',
    example: '2025-08-01T05:59:59.999Z' 
  })
  findBestProducts(@Query() bestProductsDto: BestProductsDto) {
    return this.saleItemsService.findBestProducts(bestProductsDto);
  }

}
