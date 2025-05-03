import { UserRole } from "./user-roles.interface";


export interface JwtPayload {
    sub: string;
    username: string;
    role: UserRole.ADMIN | UserRole.USER;
}