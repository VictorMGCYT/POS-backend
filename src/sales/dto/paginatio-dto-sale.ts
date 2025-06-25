import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional } from "class-validator";


export class PaginationDtoSales {

    @IsOptional()
    @Type(() => Date)
    @ApiProperty({
        type: Date,
        description: 'Fecha de inicio para filtrar las ventas',
        example: '2025-06-21T06:00:00.000Z',
        required: false
    })
    startDate?: Date;

    @IsOptional()
    @Type(() => Date)
    @ApiProperty({
        type: Date,
        description: 'Fecha de fin para filtrar las ventas',
        example: '2025-06-22T05:59:59.999Z',
        required: false
    })
    endDate?: Date;

}