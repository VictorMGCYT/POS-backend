import { applyDecorators, UseGuards } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"
import { RoleProtected } from "./role-protector.decorator"
import { UserRole } from "../interfaces/user-roles.interface"
import { UserRoleGuard } from "../guards/user-role.guard"


export const Auth = (...roles: UserRole[]) => {

    return applyDecorators(

        RoleProtected(...roles),
        UseGuards(AuthGuard(), UserRoleGuard)

    )

}