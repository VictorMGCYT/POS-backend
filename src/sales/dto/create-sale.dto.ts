import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsIn, IsString, IsUUID, Matches, ValidateNested } from "class-validator";


class SaleItemsDto {

    @IsUUID()
    productId: string;

    @IsString()
    @Matches(/^\d+(\.\d+)?$/, { message: 'quantity must be a valid decimal number' })
    quantity: string;

}

export class CreateSaleDto {

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SaleItemsDto)
    @ApiProperty({
        type: [SaleItemsDto],
        description: 'Arreglo de productos vendidos en la venta',
        example: [
            {
                productId: "15e3ecec-68db-460f-80b9-a1e0486ffc7d",
                quantity: "2"
            },
            {
                productId: "9b52bd3c-2d0a-4819-9e9b-262d4b17e8d8",
                quantity: "1"
            }
        ]
    })
    saleItems: SaleItemsDto[];
    
    @IsUUID()
    @ApiProperty({ example: '56b9bca3-87c0-4f90-bcd8-7bab53db4f59', description: 'ID del vendedor' })
    userId: string;

    @IsString()
    @IsIn(['Efectivo','Tarjeta','Transferencia'])
    @ApiProperty({
        example: 'Efectivo',
        description: 'Método de pago utilizado en la venta',
        enum: ['Efectivo', 'Tarjeta', 'Transferencia']
    })
    paymentMethod: string;

}

