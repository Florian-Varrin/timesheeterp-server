import { EntityRepository, Repository } from 'typeorm';
import { Role } from './role.entity';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { RoleDto } from '../dto/role.dto';

@EntityRepository(Role)
export class RoleRepository extends Repository<Role> {
  async add(createRoleDto: RoleDto): Promise<RoleDto> {
    const { name } = createRoleDto;

    const role = new Role();
    role.name = name.toUpperCase();

    try {
      await role.save();

      return role;
    } catch (err) {
      const EMAIL_DUPLICATE_ERROR_CODE = '23505';
      if (err.code === EMAIL_DUPLICATE_ERROR_CODE)
        throw new ConflictException('role already exists');

      throw new InternalServerErrorException();
    }
  }
}
