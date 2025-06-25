import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { SaleItemsService } from './sale-items.service';
import { CreateSaleItemDto } from './dto/create-sale-item.dto';
import { UpdateSaleItemDto } from './dto/update-sale-item.dto';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('sale-items')
export class SaleItemsController {
  constructor(private readonly saleItemsService: SaleItemsService) {}

  @Get(':id')
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

}
