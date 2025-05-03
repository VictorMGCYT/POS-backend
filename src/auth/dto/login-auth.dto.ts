import { IsString, IsStrongPassword, MinLength } from "class-validator";


export class LoginAuthDto {

    @IsString()
    @MinLength(3)
    username: string;

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
}