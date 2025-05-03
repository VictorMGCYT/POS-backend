import { SetMetadata } from "@nestjs/common";
import { UserRole } from "../interfaces/user-roles.interface";


export const META_ROLE = 'roles';

export const RoleProtected = (...args: UserRole[]) => {

    // Asignar la metadata
    return SetMetadata(META_ROLE, args);

}