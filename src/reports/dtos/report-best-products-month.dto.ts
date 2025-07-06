import { Type } from "class-transformer";
import { IsDate, IsString, MinLength } from "class-validator";


export class ReportBestProductsMonthDto {

    @IsString()
    @MinLength(3)
    username: string;

    @Type(() => Date)
    @IsDate()
    daydate: Date;
    
}