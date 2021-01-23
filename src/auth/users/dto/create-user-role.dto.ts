import { User } from '../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserRoleDto {
  @ApiProperty()
  user: User;

  @ApiProperty()
  role: string;
}
