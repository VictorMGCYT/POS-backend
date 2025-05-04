import { Type } from "class-transformer";
import { IsArray, IsIn, IsString, IsUUID, Matches, ValidateNested } from "class-validator";


export class CreateSaleDto {

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SaleItemsDto)
    saleItems: SaleItemsDto[];
    
    @IsUUID()
    userId: string;

    @IsString()
    @IsIn(['Efectivo','Tarjeta','Transferencia'])
    paymentMethod: string;

}


class SaleItemsDto {

    @IsUUID()
    productId: string;

    @IsString()
    @Matches(/^\d+(\.\d+)?$/, { message: 'quantity must be a valid decimal number' })
    quantity: string;

}