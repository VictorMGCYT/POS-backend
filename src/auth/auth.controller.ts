import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Res, Query, ParseIntPipe, ParseUUIDPipe, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { LoginAuthDto } from './dto/login-auth.dto';
import { Request, Response } from 'express';
import { Auth } from './decorators/auth.decorator';
import { UserRole } from './interfaces/user-roles.interface';
import { PaginationDto } from './dto/pagination.dto';
import { Console } from 'console';
import { Users } from './entities/auth.entity';
import { ApiCookieAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ! Logear usuario
  @Post('login')
  @ApiOperation({summary: 'Logear usuario'})
  @ApiResponse({status: 201, description: 'Success: Usuario logeado correctamente'})
  @ApiResponse({status: 400, description: 'Bad Request: Usuario o contraseña incorrectos'})
  async login(
    @Body() loginAuthDto: LoginAuthDto,
    @Res({ passthrough: true}) res: Response
  ){

    const { token, user } = await this.authService.login(loginAuthDto);

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: false, // Cambiar a true en producción
      sameSite: 'lax',
      maxAge: 2 * 60 * 60 * 1000 // 2 horas
    })

    return user;
  }

  // ! Cerrar sesión
  @Post('logout')
  @ApiOperation({summary: 'Cerrar sesión de usuario', description: 'No requiere datos'})
  @ApiResponse({status: 201, description: 'Success: El usuario ha cerrado sesión'})
  async logout(@Res({ passthrough: true}) res: Response){

    res.clearCookie('jwt', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });

    return { message: 'Logout successful' };
  }

  // ! Crear usuario
  @Post('create')
  @Auth( UserRole.ADMIN )
  @ApiCookieAuth('jwt') // <- El nombre de la cookie
  @ApiOperation({summary: 'Crear usuario', description: 'Datos para crear un nuevo usuario'})
  @ApiResponse({status: 201, description: 'Created: El usuario ha sido creado'})
  @ApiResponse({status: 400, description: 'Bad Request: El usuario ya existe en la base de datos'})
  @ApiResponse({status: 401, description: 'Unauthorized: No se ha iniciado sesión o no se cuenta con el rol de admin'})
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  // ! Obtener datos del usuario una vez que se ha logeado
  @Get('me')
  @Auth()
  @ApiCookieAuth('jwt')   
  @ApiOperation({
    summary: 'Obtener datos de usuario', 
    description: 'Obtener los datos del usuario que ha inidiado sesión'
  })  
  @ApiResponse({status: 200, description: 'Succes: Datos obtenidos correctamente'})
  getUser(@Req() req: Request){
    const {id, username, role} = req.user as Users;
    return {
      id,
      username,
      role
    };
  }

  // ! Obtener datos de los usuarios
  @Get('users')
  @Auth()
  @ApiCookieAuth('jwt')
  @ApiOperation({
    summary: 'Obtener datos de los usuarios', 
    description: 'Obtener los datos los usuarios registrados'
  }) 
  @ApiResponse({status: 200, description: 'Succes: Datos de usuarios obtenidos correctamente'})
  findAll(@Query() paginationDto: PaginationDto) {
    return this.authService.findAll(paginationDto);
  }

  @Get('user/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.authService.findOne(id);
  }

  @Patch('update-user/:id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(id, updateAuthDto);
  }

  @Delete('detele-user/:id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.authService.remove(id);
  }
}
