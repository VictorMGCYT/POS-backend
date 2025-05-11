import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entities/auth.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { PaginationDto } from './dto/pagination.dto';

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
    // TODO validar si el usuario se encuentra en softDelete
    const {password, username, ...rest} = createAuthDto;

    const userExists = await this.authRepository.findOne({
      where: {username: username},
      withDeleted: true
    });

    if (userExists) {
      if(!userExists.deletedAt){
        throw new BadRequestException('User already exists');
      }else {
        const userRestored = await this.authRepository.restore(userExists.id);

        const passwordHash = bcrypt.hashSync(password, 10);

        const updateUserRestored = this.authRepository.merge(userExists, createAuthDto);
        updateUserRestored.deletedAt = null;
        updateUserRestored.password = passwordHash;
        return await this.authRepository.save(updateUserRestored);
      }
    }

    const user = this.authRepository.create({
      ...rest,
      username: username.toLowerCase(),
      password: bcrypt.hashSync(password, 10)
    })

    try {
      await this.authRepository.save(user);
      return user;
    } catch (error) {
      return this.handleError(error);;
    }

    
  }

  // ** Listar todos los usuarios de la base de datos
  async findAll( paginationDto: PaginationDto ) {
    const { limit = 10,  offset = 0} = paginationDto;

    const [data, total] = await this.authRepository.findAndCount({
      skip: offset,
      take: limit,
      select: {
        id: true,
        username: true,
        firstName: true,
        paternalSurname: true,
        maternalSurname: true,
        role: true,
        createdAt: true,
      },
    });
  
    const currentPage = Math.floor(offset / limit) + 1;
    const totalPages = Math.ceil(total / limit);

    return {
      totalItems: total,
      currentPage,
      totalPages,
      itemsPerPage: limit,
      data,
    };
  }

  // ** Encontrar un usuario por su ID
  async findOne(id: string) {

    const user = await this.authRepository.findOneBy({id});

    if(!user){
      throw new NotFoundException('User not found')
    }

    const {password, ...rest} = user;
    return rest;
  }

  // ** Actualizar un usuario por su ID
  async update(id: string, updateAuthDto: UpdateAuthDto) {

    const user = await this.authRepository.preload({
      id,
      ...updateAuthDto
    });

    if(!user) throw new NotFoundException('User not found');

    try {
      const updatedUser = await this.authRepository.save(user);

      return updatedUser;
    } catch (error) {
      return this.handleError(error);
    }
  }

  // ** Eliminar un usuario por su ID (soft delete)
  async remove(id: string) {

    const user = await this.authRepository.findOneBy({id});
    if(!user) throw new NotFoundException('User not found');

    await this.authRepository.softDelete({id});

    return `User deleted`;
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
