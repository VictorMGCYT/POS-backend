import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Users } from "../entities/auth.entity";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { JwtPayload } from "../interfaces/payload.interface";
import { UnauthorizedException } from "@nestjs/common";
import { Request } from "express";



export class JwtStrategy extends PassportStrategy(Strategy){

    constructor(
        @InjectRepository(Users)
        private readonly userRepository: Repository<Users>,

        configService: ConfigService
    ){
        const jwtSecret = configService.get<any | undefined>('SECRETJWT_KEY');

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: jwtSecret
        })
    }

    // Con este método extraemos el payload del token, buscamos el usuario
    // Y lo devolvemos para que passport lo coloque en la request
    async validate(payload: JwtPayload) {

        const { sub, username, role } = payload;

        const user = await this.userRepository.findOneBy({ id: sub});

        if(!user){
            throw new UnauthorizedException(`Token not valid`);
        }

        if(user.deletedAt){
            throw new UnauthorizedException('User was deleted');
        }

        return user;

    }


}