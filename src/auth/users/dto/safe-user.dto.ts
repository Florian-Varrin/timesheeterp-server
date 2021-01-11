import { Role } from '../../roles/entities/role.entity';

export class SafeUserDto {
  id: number;
  email: string;
  roles: Role[];

  static getProperties() {
    return ['id', 'email', 'roles'];
  }
}
