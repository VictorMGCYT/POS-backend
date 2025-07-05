import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities/auth.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  controllers: [AuthController],
  // Colocamos el provider de JwtStrategy para que validemos el token
  providers: [AuthService, JwtStrategy],
  imports: [

    TypeOrmModule.forFeature([Users]),

    ConfigModule,

    PassportModule.register({defaultStrategy: 'jwt'}),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('SECRETJWT_KEY'),
          signOptions: {
            expiresIn: '8h'
          }
        }
      }
    })

  ],
  exports: [TypeOrmModule, AuthService, JwtModule, PassportModule]
  
})
export class AuthModule {}
