import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @MinLength(4)
  @MaxLength(50)
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(25)
  // @Matches(
  //   /^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z])$/,
  //   {
  //     message: 'password is too weak',
  //   },
  // )
  password: string;
}
