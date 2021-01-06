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
  HttpCode,
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
  findOne(
    @Param('userId') userId: string,
    @GetUser() user: User,
  ): Promise<SafeUserDto> {
    if (user.id !== +userId && !user.hasOneRole(['admin']))
      throw new ForbiddenException('You cannot access this user');

    return this.usersService.findOne(+userId);
  }

  @Patch(':userId')
  @UseGuards(AuthGuard())
  update(
    @Param('userId') userId: string,
    @GetUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<SafeUserDto> {
    if (user.id !== +userId && !user.hasOneRole(['admin']))
      throw new ForbiddenException('You cannot access this user');
    return this.usersService.update(+userId, updateUserDto);
  }

  @Delete(':userId')
  @HttpCode(204)
  @UseGuards(AuthGuard(), new RolesGuard(['ADMIN']))
  remove(@Param('userId') userId: string): Promise<void> {
    return this.usersService.remove(+userId);
  }

  @Post(':userId/roles')
  @UseGuards(AuthGuard(), new RolesGuard(['ADMIN']))
  async addRoles(
    @Body('roles') roles: string[],
    @Param('userId') userId: string,
    @GetUser() user: User,
  ): Promise<SafeUserDto> {
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
