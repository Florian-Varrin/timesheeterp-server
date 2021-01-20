import { User } from '../entities/user.entity';

export class CreateUserRoleDto {
  user: User;

  role: string;
}
