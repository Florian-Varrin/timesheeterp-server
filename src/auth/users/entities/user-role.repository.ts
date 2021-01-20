import { EntityRepository, Repository } from 'typeorm';
import { UserRole } from './user-role.entity';
import { CreateUserRoleDto } from '../dto/create-user-role.dto';
import { InternalServerErrorException } from '@nestjs/common';

@EntityRepository(UserRole)
export class UserRoleRepository extends Repository<UserRole> {
  async createUserRole(
    createUserRoleDto: CreateUserRoleDto,
  ): Promise<UserRole> {
    const { user, role } = createUserRoleDto;

    const userRole = new UserRole();
    userRole.user = user;
    userRole.role = role;

    try {
      return await userRole.save();
    } catch (err) {
      throw new InternalServerErrorException(
        `An error as occurred while adding the role \"${role}\"`,
      );
    }
  }
}
