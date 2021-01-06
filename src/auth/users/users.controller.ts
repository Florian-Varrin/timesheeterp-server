import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  ValidationPipe,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { SafeUserDto } from './dto/safe-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUser } from '../decorators/get-users.decorator';
import { User } from './entities/user.entity';
import { RolesGuard } from '../roles/guards/roles.guard';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<SafeUserDto> {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(AuthGuard(), new RolesGuard(['ADMIN']))
  findAll(): Promise<SafeUserDto[]> {
    return this.usersService.findAll();
  }

  @Get(':userId')
  @UseGuards(AuthGuard())
  findOne(@Param('userId') userId: string, @GetUser() user: User) {
    if (user.id !== +userId && !user.hasOneRole(['admin']))
      throw new ForbiddenException('You cannot access this user');

    return this.usersService.findOne(+userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }
  //
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }

  @Post(':userId/roles')
  @UseGuards(AuthGuard(), new RolesGuard(['ADMIN']))
  async addRoles(
    @Body('roles') roles: string[],
    @Param('userId') userId: string,
    @GetUser() user: User,
  ) {
    return this.usersService.addRoles(roles, user);
  }

  @Delete(':userId/roles/:roleId')
  @UseGuards(AuthGuard(), new RolesGuard(['ADMIN']))
  async removeRole(
    @Param('userId') userId: string,
    @Param('roleId') roleId: string,
    @GetUser() user: User,
  ): Promise<SafeUserDto> {
    return this.usersService.removeRole(+roleId, user);
  }
}
