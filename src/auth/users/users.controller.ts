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
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { SafeUserDto } from './dto/safe-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUser } from '../decorators/get-users.decorator';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesEnum } from '../enums/roles.enum';
import { RolesGuard } from '../guards/roles.guard';
import { UsersDocumentation } from './users.documentation';

const doc = new UsersDocumentation();

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation(doc.controller.create)
  async create(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<SafeUserDto> {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation(doc.controller.findAll)
  @ApiBearerAuth()
  @UseGuards(AuthGuard(), new RolesGuard([RolesEnum.ADMIN]))
  findAll(): Promise<SafeUserDto[]> {
    return this.usersService.findAll();
  }

  @Get(':userId')
  @ApiOperation(doc.controller.findOne)
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
  @ApiOperation(doc.controller.update)
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
  @ApiOperation(doc.controller.remove)
  @ApiBearerAuth()
  @UseGuards(AuthGuard(), new RolesGuard([RolesEnum.ADMIN]))
  remove(@Param('userId') userId: string): Promise<void> {
    return this.usersService.remove(+userId);
  }

  @Post(':userId/roles')
  @ApiOperation(doc.controller.addRoles)
  @ApiBearerAuth()
  @UseGuards(AuthGuard(), new RolesGuard([RolesEnum.ADMIN]))
  async addRoles(
    @Body('roles') roles: string[],
    @Param('userId') userId: string,
  ): Promise<SafeUserDto> {
    return this.usersService.addRoles(roles, +userId);
  }

  @Delete(':userId/roles/:roleId')
  @ApiOperation(doc.controller.removeRole)
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
