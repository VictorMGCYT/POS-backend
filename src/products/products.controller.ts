import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { UserRole } from 'src/auth/interfaces/user-roles.interface';
import { PaginationDto } from 'src/auth/dto/pagination.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('create')
  @Auth( UserRole.ADMIN )
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get('get-all')
  @Auth()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.productsService.findAll(paginationDto);
  }

  @Get('product/:id')
  @Auth()
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @Auth( UserRole.ADMIN )
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  @Auth( UserRole.ADMIN )
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
