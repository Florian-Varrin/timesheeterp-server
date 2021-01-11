import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as config from 'config';
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
      secretOrKey: config.get('jwt.secret'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
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
