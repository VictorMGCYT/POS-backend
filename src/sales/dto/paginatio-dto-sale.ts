import { Type } from "class-transformer";
import { IsOptional } from "class-validator";


export class PaginationDtoSales {

    @IsOptional()
    @Type(() => Number)
    limit?: number;

    @IsOptional()
    @Type(() => Number)
    offset?: number;

    @IsOptional()
    @Type(() => Date)
    startDate?: Date;

    @IsOptional()
    @Type(() => Date)
    endDate?: Date;

}