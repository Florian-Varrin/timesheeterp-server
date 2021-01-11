import { Injectable, NotFoundException } from '@nestjs/common';
import { RoleDto } from './dto/role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleRepository } from './entities/role.repository';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RoleRepository)
    private roleRepository: RoleRepository,
  ) {}

  create(roleDto: RoleDto): Promise<RoleDto> {
    const { name } = roleDto;
    return this.roleRepository.createRole({ name });
  }

  findAll(): Promise<RoleDto[]> {
    return this.roleRepository.find();
  }

  async findOne(id: number): Promise<RoleDto> {
    const role = await this.roleRepository.findOne(id);

    if (!role) throw new NotFoundException('role not found');

    return role;
  }

  async update(id: number, roleDto: RoleDto): Promise<RoleDto> {
    const role = await this.findOne(id);

    roleDto.name = roleDto.name.toUpperCase();

    return this.roleRepository.save({
      ...role,
      ...roleDto,
    });
  }

  async remove(id: number): Promise<void> {
    const { affected } = await this.roleRepository.delete(id);

    if (affected === 0) throw new NotFoundException('role not found');
  }
}
