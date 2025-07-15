import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { UserRole } from 'src/auth/interfaces/user-roles.interface';
import { PaginationDto } from 'src/auth/dto/pagination.dto';
import { FilterProductsDto } from './dto/filter-products.dto';
import { ApiCookieAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('create')
  @Auth( UserRole.ADMIN )
  @ApiCookieAuth('jwt')
  @ApiOperation({
    summary: 'Crea un nuevo producto',
    description: 'Permite crear un nuevo producto en el sistema.'
  })
  @ApiResponse({status: 201, description: 'Success: Producto creado correctamente'})
  @ApiResponse({status: 400, description: 'Bad Request: El producto con el skuCode ya existe o hay un error en los datos proporcionados'})
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get('get-all')
  @Auth()
  @ApiCookieAuth('jwt')
  @ApiOperation({
    summary: 'Obtiene todos los productos',
    description: 'Permite obtener una lista de productos con opciones de filtrado y paginación.'
  })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Texto para buscar productos' })
  @ApiQuery({ name: 'orderProducts', required: false, enum: ['asc', 'desc'], description: 'Orden de los productos' })
  @ApiQuery({ name: 'stockOrder', required: false, enum: ['asc', 'desc'], description: 'Orden del stock' })
  @ApiQuery({ name: 'productsTipe', required: false, enum: ['all', 'unit', 'weight'], description: 'Tipo de producto' })
  @ApiResponse({status: 200, description: 'Success: Lista de productos obtenida correctamente'})
  @ApiResponse({status: 404, description: 'Not Found: No se encontraron productos'})
  findAll(@Query() filterProductsDto: FilterProductsDto) {
    return this.productsService.findAll(filterProductsDto);
  }

  @Get('product/:id')
  @Auth()
  @ApiCookieAuth('jwt')
  @ApiOperation({
    summary: 'Obtiene un producto por ID',
    description: 'Permite obtener un producto específico utilizando su ID.'
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID del producto a buscar',
    example: '15e3ecec-68db-460f-80b9-a1e0486ffc7d'
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.findOne(id);
  }

  @Patch('update/:id')
  @Auth( UserRole.ADMIN )
  @ApiCookieAuth('jwt')
  @ApiOperation({
    summary: 'Actualiza un producto por ID',
    description: 'Permite actualizar los datos de un producto específico utilizando su ID.'
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID del producto a actualizar',
    example: '15e3ecec-68db-460f-80b9-a1e0486ffc7d'
  })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete('delete/:id')
  @Auth( UserRole.ADMIN )
  @ApiCookieAuth('jwt')
  @ApiOperation({
    summary: 'Elimina un producto por ID',
    description: 'Permite eliminar un producto específico utilizando su ID.'
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID del producto a eliminar',
    example: '15e3ecec-68db-460f-80b9-a1e0486ffc7d'
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}
