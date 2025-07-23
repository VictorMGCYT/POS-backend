import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Res, Query, ParseIntPipe, ParseUUIDPipe, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { Request, Response } from 'express';
import { Auth } from './decorators/auth.decorator';
import { UserRole } from './interfaces/user-roles.interface';
import { PaginationDto } from './dto/pagination.dto';
import { Users } from './entities/auth.entity';
import { ApiCookieAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';

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

    return {
      user,
      token
    };
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
    summary: 'Obtener datos del usuario que se ha logueado', 
    description: 'Obtener los datos del usuario que ha iniciado sesión'
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
    description: 'Obtener los datos de todos los usuarios registrados'
  }) 
  @ApiResponse({status: 200, description: 'Succes: Datos de usuarios obtenidos correctamente'})
  findAll() {
    return this.authService.findAll();
  }

  // ! Obtener datos de un usuario en especifico
  @Get('user/:id')
  @Auth()
  @ApiCookieAuth('jwt')
  @ApiOperation({
    summary: 'Obtener datos un usuario por ID', 
    description: 'Obtiene los datos de un usuario en específico mediante su ID'
  }) 
  @ApiResponse({status: 200, description: 'Succes: Datos de usuario obtenidos correctamente'})
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.authService.findOne(id);
  }

  // ! Editar los datos de un usuario en especifico
  @Patch('update-user/:id')
  @Auth()
  @ApiCookieAuth('jwt')
  @ApiOperation({
    summary: 'Editar datos de un usuario', 
    description: 'Campos opcionales para editar la info de algún usuario'
  }) 
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'UUID del usuario a editar',
    example: '2eb1de1b-476f-4371-8dc4-9e208f7f7827',
  })
  @ApiResponse({status: 200, description: 'Succes: Se ha editado el usuario correctamente'})
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(id, updateAuthDto);
  }

  // ! Editar usuario por su ID
  @Delete('delete-user/:id')
  @Auth()
  @ApiCookieAuth('jwt')
  @ApiOperation({
    summary: 'Borrar usuario', 
    description: 'Borrar usuario mediante su UUID'
  }) 
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'UUID del usuario a editar',
    example: '2eb1de1b-476f-4371-8dc4-9e208f7f7827',
  })
  @ApiResponse({status: 200, description: 'Succes: Se ha eliminado el usuario'})
  @ApiResponse({status: 404, description: 'Nof Found: Usuario no encontrado'})
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.authService.remove(id);
  }
}
