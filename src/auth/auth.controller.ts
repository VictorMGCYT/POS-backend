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

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
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

  @Post('logout')
  async logout(@Res({ passthrough: true}) res: Response){

    res.clearCookie('jwt', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });

    return { message: 'Logout successful' };
  }

  @Post('create')
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Get('me')
  @Auth()
  getUser(@Req() req: Request){
    const {id, username, role} = req.user as Users;
    return {
      id,
      username,
      role
    };
  }

  @Get('users')
  @Auth()
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
