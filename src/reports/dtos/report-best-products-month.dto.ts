import { Type } from "class-transformer";
import { IsDate, IsIn, IsString, MinLength } from "class-validator";


export class ReportBestProductsMonthDto {

    @IsString()
    @MinLength(3)
    username: string;

    @Type(() => Date)
    @IsDate()
    daydate: Date;

    @IsString()
    @IsIn(['day', 'week', 'month'])
    period: string;
    
}