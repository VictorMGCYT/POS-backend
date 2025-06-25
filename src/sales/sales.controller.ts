import { Controller, Get, Post, Body, Param, Query, ParseUUIDPipe } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { PaginationDtoSales } from './dto/paginatio-dto-sale';
import { ApiCookieAuth, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  // ! crear una venta
  @Auth()
  @ApiCookieAuth('jwt')
  @ApiOperation({ summary: 'Crear una venta', description: 'Datos para crear una nueva venta' })
  @ApiResponse({ status: 201, description: 'Venta creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Error al crear la venta'})
  @Post('create')
  @Auth()
  create(@Body() createSaleDto: CreateSaleDto) {
    return this.salesService.create(createSaleDto);
  }

  // ! obtener todas las ventas
  @Get('get')
  @Auth()
  @ApiCookieAuth('jwt')
  @ApiOperation({ summary: 'Obtener todas las ventas', description: 'Lista de todas las ventas registradas' })
  @ApiResponse({ status: 200, description: 'Lista de ventas obtenida exitosamente' })
  @ApiResponse({ status: 404, description: 'No se encontraron ventas con la fecha dada' })
  findAll(@Query() paginationDtoSale: PaginationDtoSales) {
    return this.salesService.findAll(paginationDtoSale);
  }

  // ! obtener una venta por id
  @Get('get/:id')
  @Auth()
  @ApiCookieAuth('jwt')
  @ApiOperation({ summary: 'Obtener una venta por ID', description: 'Detalles de una venta específica' })
  @ApiParam({ 
    name: 'id', 
    description: 'ID de la venta a obtener', 
    type: String,
    example: '37c401d1-ec4a-4946-9216-2e5858f26f65'
  })
  @ApiResponse({ status: 200, description: 'Venta obtenida exitosamente'})
  @ApiResponse({ status: 404, description: 'Venta no encontrada' })
  @ApiResponse({ status: 400, description: 'ID de venta inválido' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.salesService.findOne(id);
  }

}
