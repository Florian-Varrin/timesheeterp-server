import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './entities/user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { SafeUserDto } from './dto/safe-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { RolesEnum } from '../enums/roles.enum';
import { UserRoleRepository } from './entities/user-role.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @InjectRepository(UserRoleRepository)
    private userRoleRepository: UserRoleRepository,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<SafeUserDto> {
    return await this.userRepository.createUser(createUserDto);
  }

  async findAll(): Promise<SafeUserDto[]> {
    const users = await this.userRepository.find({ relations: ['roles'] });

    return users.map((user) => user.makeSafe());
  }

  async findOne(
    id: number,
    withRoles = true,
    makeSafe = true,
  ): Promise<SafeUserDto | User> {
    const options = withRoles ? { relations: ['roles'] } : {};

    const user = await this.userRepository.findOne({ id }, options);

    if (!user) throw new NotFoundException('User not found');

    return makeSafe ? user.makeSafe() : user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<SafeUserDto> {
    const user = <User>await this.findOne(id, true, false);

    return await this.userRepository.updateUser(user, updateUserDto);
  }

  async remove(id: number): Promise<void> {
    const { affected } = await this.userRepository.delete(id);

    if (affected === 0) throw new NotFoundException('User not found');
  }

  async addRoles(roles: string[], userId: number): Promise<SafeUserDto> {
    const user = (await this.findOne(userId, false, false)) as User;

    for (let role of roles) {
      role = role.toUpperCase();

      if (!RolesEnum[role])
        throw new BadRequestException(`Role \"${role}\" does not exist`);

      const roleAlreadyExist = !!(await this.userRoleRepository.findOne({
        user_id: userId,
        role,
      }));

      if (roleAlreadyExist)
        throw new ConflictException(
          `The user ${userId} already has the role \"${role}\"`,
        );

      await this.userRoleRepository.createUserRole({ user, role });
    }

    return (await this.findOne(user.id)) as SafeUserDto;
  }

  async removeRole(roleId: number, user: User): Promise<SafeUserDto> {
    const userRole = await this.userRoleRepository.findOne(roleId);

    if (!userRole) throw new NotFoundException('Role not found');

    if (userRole.user_id !== user.id)
      throw new ForbiddenException('You cannot access this role');

    await this.userRoleRepository.delete(roleId);

    return (await this.findOne(user.id)) as SafeUserDto;
  }
}
