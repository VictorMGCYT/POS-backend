import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate } from "class-validator";


export class BestProductsDto {

    @Type(() => Date)
    @IsDate()
    dayStart: Date;

    @Type(() => Date)
    @IsDate()
    dayEnd: Date;

}