import { IsIn, IsOptional, IsString, IsStrongPassword, MinLength } from "class-validator";
import { UserRole } from "../interfaces/user-roles.interface";


export class CreateAuthDto {

    @IsString()
    @MinLength(3)
    username: string;

    @IsString()
    @MinLength(3)
    firstName: string;

    @IsString()
    @MinLength(3)
    paternalSurname: string;

    @IsString()
    @MinLength(3)
    maternalSurname: string;

    @IsString()
    @IsStrongPassword({
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 0,
    },
    {
        message: "Password must be contain min 6 chacacters, 1 letter in lowercase, 1 letter in uppercase and 1 number"
    })
    password: string;

    @IsOptional()
    @IsIn( [UserRole.ADMIN, UserRole.USER] )
    role?: string;

}
