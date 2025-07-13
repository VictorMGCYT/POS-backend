import { Type } from "class-transformer";
import { IsDate } from "class-validator";


export class NoSalesProductsDto {

    @Type(() => Date)
    @IsDate()
    dayStart: Date;

    @Type(() => Date)
    @IsDate()
    dayEnd: Date;

}