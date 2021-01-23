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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('projects')
@ApiTags('projects')
@ApiBearerAuth()
@UseGuards(AuthGuard())
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a project' })
  create(
    @Body(ValidationPipe) createProjectDto: CreateProjectDto,
    @GetUser() user: User,
  ): Promise<Project> {
    return this.projectsService.create(createProjectDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all projects' })
  findAll(@GetUser() user: User): Promise<Project[]> {
    return this.projectsService.findAll(user);
  }

  @Get(':projectId')
  @ApiOperation({ summary: 'Get a project' })
  findOne(
    @Param('projectId') projectId: string,
    @GetUser() user: User,
  ): Promise<Project> {
    return this.projectsService.findOne(+projectId, user);
  }

  @Patch(':projectId')
  @ApiOperation({ summary: 'Update a project' })
  update(
    @Param('projectId') projectId: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @GetUser() user: User,
  ): Promise<Project> {
    return this.projectsService.update(+projectId, updateProjectDto, user);
  }

  @Delete(':projectId')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete a project' })
  remove(
    @Param('projectId') projectId: string,
    @GetUser() user: User,
  ): Promise<void> {
    return this.projectsService.remove(+projectId, user);
  }
}
