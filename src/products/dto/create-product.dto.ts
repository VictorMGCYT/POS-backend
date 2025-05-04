import { IsBoolean, IsPositive, IsString, Matches, MaxLength, Min, MinLength } from 'class-validator';


export class CreateProductDto {

    @IsString()
    @MinLength(3)
    @MaxLength(255)
    name: string;

    @IsString()
    @MinLength(3)
    @MaxLength(100)
    skuCode: string;

    @IsBoolean()
    isByWeight: boolean;

    @IsString()
    @Matches(/^\d+(\.\d+)?$/, { message: 'unitPrice must be a valid decimal number' })
    unitPrice: string;

    @IsString()   
    @Matches(/^\d+(\.\d+)?$/, { message: 'purchasePrice must be a valid decimal number' })
    purchasePrice: string;

    @IsString()
    @Matches(/^\d+(\.\d+)?$/, { message: 'stockQuantity must be a valid decimal number' })
    stockQuantity: string;

}
