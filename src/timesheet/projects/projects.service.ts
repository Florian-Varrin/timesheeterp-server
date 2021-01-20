import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectRepository } from './entities/project.repository';
import { User } from '../../auth/users/entities/user.entity';
import { Project } from './entities/project.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(ProjectRepository)
    private projectRepository: ProjectRepository,
  ) {}

  async create(
    createProjectDto: CreateProjectDto,
    user: User,
  ): Promise<Project> {
    return await this.projectRepository.createProject(createProjectDto, user);
  }

  async findAll(user: User): Promise<Project[]> {
    const projects = await this.projectRepository.getProjects(user.id);

    return projects;
  }

  async findOne(id: number, user: User): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: {
        id,
        archived: false,
      },
    });

    if (!project) throw new NotFoundException('Project not found');

    if (project.user_id !== user.id)
      throw new ForbiddenException('You cannot access this project');

    delete project.archived;

    return project;
  }

  async update(
    id: number,
    updateProjectDto: UpdateProjectDto,
    user: User,
  ): Promise<Project> {
    const { name, hour_rate } = updateProjectDto;

    const project = await this.findOne(id, user);

    if (name) project.name = name;
    if (hour_rate) project.hour_rate = hour_rate;

    await project.save();

    delete project.archived;

    return project;
  }

  async remove(id: number, user: User): Promise<void> {
    const project = await this.findOne(id, user);

    project.archived = true;
    await project.save();
  }
}
