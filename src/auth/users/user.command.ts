import { Command, Option } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { UsersService } from './users.service';

@Injectable()
export class UserCommand {
  constructor(private readonly userService: UsersService) {}

  @Command({
    command: 'user:create',
    describe: 'create a user',
    autoExit: true,
  })
  async create(
    @Option({
      name: 'email',
      describe: 'the email',
      type: 'string',
      alias: 'e',
      required: true,
    })
    email: string,
    @Option({
      name: 'password',
      describe: 'the password',
      type: 'string',
      alias: 'p',
      required: true,
    })
    password: string,

    @Option({
      name: 'roles',
      describe: 'roles of the user',
      type: 'array',
      alias: 'r',
    })
    roles: string[],
  ) {
    const { id: userId } = await this.userService.create({
      email,
      password,
    });

    if (!roles) return;

    try {
      await this.userService.addRoles(roles, userId);
    } catch (error) {
      await this.userService.remove(userId);

      throw error;
    }
  }
}
