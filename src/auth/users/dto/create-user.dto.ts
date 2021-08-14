import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UsersDocumentation } from '../users.documentation';

const doc = new UsersDocumentation();

export class CreateUserDto {
  @ApiProperty(doc.dto.create.email)
  @IsEmail()
  @MinLength(4)
  @MaxLength(50)
  email: string;

  @ApiProperty(doc.dto.create.password)
  @IsString()
  @MinLength(6)
  @MaxLength(35)
  @Matches(
    /^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).*$/,
    {
      message: 'password is too weak',
    },
  )
  password: string;
}
