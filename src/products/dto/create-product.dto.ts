import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString, Matches, MaxLength, Min, MinLength } from 'class-validator';


export class CreateProductDto {

    @IsString()
    @MinLength(3)
    @MaxLength(255)
    @ApiProperty({
        description: 'Nombre del productp',
        minLength: 3,
        maxLength: 255,
        example: 'Desodorante en barra Gillette Active Fresh 82g'
    })
    name: string;

    @IsString()
    @MinLength(3)
    @MaxLength(100)
    @ApiProperty({
        description: 'Código de barras del producto',
        minLength: 3,
        maxLength: 100,
        example: '7702018913619'
    })
    skuCode: string;

    @IsBoolean()
    @ApiProperty({
        description: 'Indica si el producto es por peso',
        example: false
    })
    isByWeight: boolean;

    @IsString()
    @Matches(/^\d+(\.\d+)?$/, { message: 'unitPrice must be a valid decimal number' })
    @ApiProperty({
        description: 'Precio unitario del producto',
        example: '90.99',
        pattern: '^\d+(\.\d+)?$'
    })
    unitPrice: string;

    @IsString()   
    @Matches(/^\d+(\.\d+)?$/, { message: 'purchasePrice must be a valid decimal number' })
    @ApiProperty({
        description: 'Precio de compra del producto',
        example: '80.00',
        pattern: '^\d+(\.\d+)?$'
    })
    purchasePrice: string;

    @IsString()
    @Matches(/^\d+(\.\d+)?$/, { message: 'stockQuantity must be a valid decimal number' })
    @ApiProperty({
        description: 'Cantidad de stock del producto',
        example: '10',
        pattern: '^\d+(\.\d+)?$'
    })
    stockQuantity: string;

}
