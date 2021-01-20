import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { RolesEnum } from '../enums/roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private roles: RolesEnum[]) {}

  canActivate(context: ExecutionContext): boolean {
    if (!this.roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const hasPermission = user.roles.some((role) => {
      const roleValue = (RolesEnum[role.role] as unknown) as number;
      return this.roles.includes(roleValue);
    });

    return hasPermission;
  }
}
