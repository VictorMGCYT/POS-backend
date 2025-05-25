import { IsOptional, IsString, IsIn } from 'class-validator';
import { PaginationDto } from 'src/auth/dto/pagination.dto';

export class FilterProductsDto extends PaginationDto {
  
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  orderProducts?: 'asc' | 'desc'; 

  @IsOptional()
  @IsIn(['asc', 'desc'])
  stockOrder?: 'asc' | 'desc'; 

  @IsOptional()
  @IsIn(['all', 'unit', 'weight'])
  productsTipe?: 'all' | 'unit' | 'weight';
}
