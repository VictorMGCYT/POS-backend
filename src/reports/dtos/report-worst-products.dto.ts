import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsIn, IsString, MinLength } from "class-validator";


export class ReportWorstProductsDto {

    @IsString()
    @MinLength(3)
    @ApiProperty({
        description: 'Id del usuario que genera el reporte',
        example: '56b9bca3-87c0-4f90-bcd8-7bab53db4f59'
    })
    userId: string;

    @ApiProperty({
        description: 'Fecha de referencia para el reporte',
        example: '2025-07-05T00:00:00Z'
    })
    @Type(() => Date)
    @IsDate()
    daydate: Date;

    @IsString()
    @IsIn(['day', 'week', 'month'])
    @ApiProperty({
        description: 'Período del reporte',
        example: 'month',
        enum: ['day', 'week', 'month']
    })
    period: string;
    
}