import { FormattedUserRolesDto } from './formatted-user-roles.dto';
import { ApiProperty } from '@nestjs/swagger';

export class SafeUserDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  email: string;
  @ApiProperty()
  roles: FormattedUserRolesDto;

  static getProperties() {
    return ['id', 'email', 'roles', 'main_clock_id'];
  }
}
