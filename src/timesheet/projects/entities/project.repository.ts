import { EntityRepository, Repository } from 'typeorm';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Project } from './project.entity';
import { CreateProjectDto } from '../dto/create-project.dto';
import { User } from '../../../auth/users/entities/user.entity';

@EntityRepository(Project)
export class ProjectRepository extends Repository<Project> {
  async getProjects(userId: number): Promise<Project[]> {
    const query = this.createQueryBuilder('project');

    query.andWhere('project.user_id = :userId', { userId });
    query.andWhere('project.archived = false');

    const projects = await query.getMany();

    return projects.map((project) => {
      delete project.archived;

      return project;
    });
  }

  async createProject(
    createProjectDto: CreateProjectDto,
    user: User,
  ): Promise<Project> {
    const { name, hour_rate } = createProjectDto;

    const project = new Project();
    project.name = name;
    project.hour_rate = +hour_rate;
    project.user = user;
    project.archived = false;

    try {
      await project.save();

      delete project.user;
      delete project.archived;

      return project;
    } catch (err) {
      const EMAIL_DUPLICATE_ERROR_CODE = '23505';
      if (err.code === EMAIL_DUPLICATE_ERROR_CODE)
        throw new ConflictException('Project already exists');

      throw new InternalServerErrorException(
        'An error as occurred while creating a project',
      );
    }
  }
}
