import { EntityRepository, Repository } from 'typeorm';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';
import { AuthCredentialsDto } from '../../dto/auth-credentials.dto';
import { SafeUserDto } from '../dto/safe-user.dto';
import { CreateUserDto } from '../dto/create-user.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(createUserDto: CreateUserDto): Promise<SafeUserDto> {
    const { email, password } = createUserDto;

    const user = new User();
    user.email = email;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);

    try {
      await user.save();

      return user.makeSafe(user);
    } catch (err) {
      const EMAIL_DUPLICATE_ERROR_CODE = '23505';
      if (err.code === EMAIL_DUPLICATE_ERROR_CODE)
        throw new ConflictException('email already exists');

      throw new InternalServerErrorException();
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return await bcrypt.hash(password, salt);
  }

  async validateUserPassword(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<SafeUserDto | null> {
    const { email, password } = authCredentialsDto;
    const user = await this.findOne({ email });

    const isValid = user && (await user.validatePassword(password));

    if (isValid) {
      return {
        id: user.id,
        email: user.email,
      };
    }

    return null;
  }
}
