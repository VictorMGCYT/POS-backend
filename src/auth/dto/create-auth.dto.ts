import { IsIn, IsOptional, IsString, IsStrongPassword, MinLength } from "class-validator";
import { UserRole } from "../interfaces/user-roles.interface";
import { ApiProperty } from "@nestjs/swagger";


export class CreateAuthDto {

    @IsString()
    @MinLength(3)
    @ApiProperty({example: 'victormgc', description: 'Nombre de usuario'})
    username: string;

    @IsString()
    @MinLength(3)
    @ApiProperty({example: 'Victor Manuel', description: 'Nombre de pila'})
    firstName: string;

    @IsString()
    @MinLength(3)
    @ApiProperty({example: 'Gonzalez', description: 'Apellido paterno del usuario'})
    paternalSurname: string;

    @IsString()
    @MinLength(3)
    @ApiProperty({example: 'Cabrera', description: 'Apellido materno del usuario'})
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
    @ApiProperty({example: 'MiSuperPass777', description: 'Contraseña'})
    password: string;

    @IsOptional()
    @IsIn( [UserRole.ADMIN, UserRole.USER] )
    @ApiProperty({example: UserRole.USER, description: 'Rol del usuario', required: false})
    role?: string;

}
