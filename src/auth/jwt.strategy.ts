import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SafeUserDto } from './users/dto/safe-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './users/entities/user.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'reallysecret',
    });
  }

  async validate(payload: SafeUserDto) {
    const { id: userId } = payload;
    const user = await this.userRepository.findOne(userId, {
      relations: ['roles'],
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
