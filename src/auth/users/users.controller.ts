import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { SafeUserDto } from './dto/safe-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUser } from '../decorators/get-users.decorator';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesEnum } from '../enums/roles.enum';
import { RolesGuard } from '../guards/roles.guard';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a user' })
  async create(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<SafeUserDto> {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard(), new RolesGuard([RolesEnum.ADMIN]))
  findAll(): Promise<SafeUserDto[]> {
    return this.usersService.findAll();
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get a user' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  findOne(
    @Param('userId') userId: string,
    @GetUser() user: User,
  ): Promise<SafeUserDto> {
    if (user.id !== +userId && !user.hasOneRole([RolesEnum.ADMIN]))
      throw new ForbiddenException('You cannot access this user');

    return this.usersService.findOne(+userId) as Promise<SafeUserDto>;
  }

  @Patch(':userId')
  @ApiOperation({ summary: 'Update a user' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  update(
    @Param('userId') userId: string,
    @GetUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<SafeUserDto> {
    if (user.id !== +userId && !user.hasOneRole([RolesEnum.ADMIN]))
      throw new ForbiddenException('You cannot access this user');
    return this.usersService.update(+userId, updateUserDto);
  }

  @Delete(':userId')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete a user' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard(), new RolesGuard([RolesEnum.ADMIN]))
  remove(@Param('userId') userId: string): Promise<void> {
    return this.usersService.remove(+userId);
  }

  @Post(':userId/roles')
  @ApiOperation({ summary: 'Add a role to a user' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard(), new RolesGuard([RolesEnum.ADMIN]))
  async addRoles(
    @Body('roles') roles: string[],
    @Param('userId') userId: string,
  ): Promise<SafeUserDto> {
    return this.usersService.addRoles(roles, +userId);
  }

  @Delete(':userId/roles/:roleId')
  @ApiOperation({ summary: 'Delete a role to a user' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard(), new RolesGuard([RolesEnum.ADMIN]))
  async removeRole(
    @Param('userId') userId: string,
    @Param('roleId') roleId: string,
    @GetUser() user: User,
  ): Promise<SafeUserDto> {
    return this.usersService.removeRole(+roleId, user);
  }
}
