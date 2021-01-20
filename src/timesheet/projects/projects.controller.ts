import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  ValidationPipe,
  HttpCode,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../../auth/decorators/get-users.decorator';
import { User } from '../../auth/users/entities/user.entity';
import { Project } from './entities/project.entity';

@Controller('projects')
@UseGuards(AuthGuard())
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(
    @Body(ValidationPipe) createProjectDto: CreateProjectDto,
    @GetUser() user: User,
  ): Promise<Project> {
    return this.projectsService.create(createProjectDto, user);
  }

  @Get()
  findAll(@GetUser() user: User): Promise<Project[]> {
    return this.projectsService.findAll(user);
  }

  @Get(':projectId')
  findOne(
    @Param('projectId') projectId: string,
    @GetUser() user: User,
  ): Promise<Project> {
    return this.projectsService.findOne(+projectId, user);
  }

  @Patch(':projectId')
  update(
    @Param('projectId') projectId: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @GetUser() user: User,
  ): Promise<Project> {
    return this.projectsService.update(+projectId, updateProjectDto, user);
  }

  @Delete(':projectId')
  @HttpCode(204)
  remove(
    @Param('projectId') projectId: string,
    @GetUser() user: User,
  ): Promise<void> {
    return this.projectsService.remove(+projectId, user);
  }
}
