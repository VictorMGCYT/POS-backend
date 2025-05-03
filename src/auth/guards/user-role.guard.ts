import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import * as request from 'supertest';
import { Users } from '../entities/auth.entity';
import { META_ROLE } from '../decorators/role-protector.decorator';

@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector
  ){}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    

    // extraemos la metadata 'roles' o sea lo que se pasó por parametros
    //  en el Auth( -lo de aquí- )
    const roleAsigned: string[] = this.reflector.getAllAndOverride(META_ROLE, [
      context.getHandler(),
      context.getClass(),
    ])

    const request = context.switchToHttp().getRequest();
    const user = request.user as Users;

    if(!user){
      throw new BadRequestException();
    }
    
    if(roleAsigned.length === 0){
      return true;
    }

    if(roleAsigned.includes(user.role)){
      return true;
    }

    throw new ForbiddenException(
      `User ${user.username} need role: [${roleAsigned}]`,
    );

  }
}
