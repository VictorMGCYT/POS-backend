import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { LoginAuthDto } from './dto/login-auth.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() loginAuthDto: LoginAuthDto,
    @Res({ passthrough: true}) res: Response
  ){

    const { token } = await this.authService.login(loginAuthDto);

    res.cookie('jwt', token, {
      httpOnly: false,
      secure: false, // Cambiar a true en producción
      sameSite: 'lax',
      maxAge: 2 * 60 * 60 * 1000 // 2 horas
    })

    return { message: 'Login successful' };
  }

  @Post('create')
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Get('users')
  @UseGuards(AuthGuard())
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
