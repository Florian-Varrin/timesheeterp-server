import { UserRole } from '../entities/user-role.entity';
import { FormattedUserRolesDto } from './formatted-user-roles.dto';

export class SafeUserDto {
  id: number;
  email: string;
  roles: FormattedUserRolesDto;

  static getProperties() {
    return ['id', 'email', 'roles'];
  }
}
