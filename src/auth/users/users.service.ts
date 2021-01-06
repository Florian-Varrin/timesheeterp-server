import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './entities/user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { SafeUserDto } from './dto/safe-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { RoleRepository } from '../roles/entities/role.repository';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @InjectRepository(RoleRepository)
    private roleRepository: RoleRepository,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<SafeUserDto> {
    return await this.userRepository.add(createUserDto);
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

    if (!user) throw new NotFoundException('user not found');

    return makeSafe ? user.makeSafe() : user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<SafeUserDto> {
    const user = <User>await this.findOne(id, true, false);

    return await this.userRepository.modify(user, updateUserDto);
  }

  async remove(id: number): Promise<void> {
    const { affected } = await this.userRepository.delete(id);

    if (affected === 0) throw new NotFoundException('user not found');
  }

  async addRoles(roles: string[], user: User): Promise<SafeUserDto> {
    const mappedRoles = roles.map(async (role) => {
      const mappedRole = await this.roleRepository.findOne({
        name: role.toUpperCase(),
      });

      if (!mappedRole)
        throw new BadRequestException(`role \"${role}\" does not exist`);

      return mappedRole;
    });

    const resolvedMappedRoles = await Promise.all(mappedRoles);

    const userRoles = [...user.roles];
    const presentRolesIds = userRoles.map((role) => role.id);
    resolvedMappedRoles.forEach((role) => {
      if (!presentRolesIds.includes(role.id)) userRoles.push(role);
    });

    user.roles = userRoles;

    await user.save();

    return user.makeSafe();
  }

  async removeRole(roleId: number, user: User): Promise<SafeUserDto> {
    const role = await this.roleRepository.findOne(roleId);
    if (!role)
      throw new NotFoundException(`role with id ${roleId} does not exist`);

    const hasThisRole = user.roles.some((userRole) => userRole.id === role.id);

    if (!hasThisRole)
      throw new BadRequestException(
        `the user does not have the role \"${role.name}\"`,
      );

    user.roles = user.roles.filter((userRole) => userRole.id !== role.id);

    await user.save();

    return user.makeSafe();
  }
}
