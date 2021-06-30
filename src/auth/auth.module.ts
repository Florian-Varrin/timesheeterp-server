import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import * as config from 'config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRepository } from './users/entities/user.repository';
import { JwtStrategy } from './jwt.strategy';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { UserRoleRepository } from './users/entities/user-role.repository';
import { UserCommand } from './users/user.command';

const { secret, expiresIn } = config.get('jwt');

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.register({
      secret,
      signOptions: { expiresIn },
    }),
    TypeOrmModule.forFeature([UserRepository, UserRoleRepository]),
  ],
  controllers: [UsersController, AuthController],
  providers: [UsersService, UserCommand, AuthService, JwtStrategy],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
