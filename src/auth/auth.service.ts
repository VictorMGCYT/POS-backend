import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entities/auth.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(Users)
    private readonly authRepository: Repository<Users>,

    private readonly jwtService: JwtService
  ){}

  // ** Login del usuario para generar el JWT respectivo a el
  async login(loginAuthDto: LoginAuthDto){

    const {username, password} = loginAuthDto;
    const user = await this.authRepository.findOneBy({username});

    if(!user) throw new BadRequestException('User not found');

    if(!bcrypt.compareSync(password, user.password)){
      throw new BadRequestException('Password is incorrect');
    }

    const payload = { sub: user.id, username: user.username, role: user.role };
    
    return {
      token: this.jwtService.sign(payload)
    }

  }

  // ** Creación de un nuevo usario en la base de datos
  async create(createAuthDto: CreateAuthDto) {

    const {password, ...rest} = createAuthDto;

    const user = this.authRepository.create({
      ...rest,
      password: bcrypt.hashSync(password, 10)
    })

    try {
      await this.authRepository.save(user);
      return user;
    } catch (error) {
      return this.handleError(error);;
    }

    
  }

  async findAll() {
    // TODO agregar paginacion
    return await this.authRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  private handleError(error: any){
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);;	
    } else if (error.code === '23503') {
      return 'User not found';
    } else {
      throw new InternalServerErrorException(error.detail);
    }
  }

}
