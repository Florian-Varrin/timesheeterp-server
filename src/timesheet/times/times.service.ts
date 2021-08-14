import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTimeDto } from './dto/create-time.dto';
import { UpdateTimeDto } from './dto/update-time.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectsService } from '../projects/projects.service';
import { User } from '../../auth/users/entities/user.entity';
import { TimeRepository } from './entities/time.repository';
import { Time } from './entities/time.entity';
import { TimesFilterDto } from './dto/times-filter.dto';

@Injectable()
export class TimesService {
  constructor(
    @InjectRepository(TimeRepository)
    private timeRepository: TimeRepository,
    private projectsService: ProjectsService,
  ) {}

  async create(
    createTimeDto: CreateTimeDto,
    projectId: number,
    user: User,
  ): Promise<Time> {
    const project = await this.projectsService.findOneById(projectId, user);

    return this.timeRepository.createTime(createTimeDto, project);
  }

  async findAll(
    projectId: number,
    user: User,
    timesFilterDto: TimesFilterDto,
  ): Promise<Time[]> {
    await this.projectsService.findOneById(projectId, user);

    return await this.timeRepository.getTimes(projectId, timesFilterDto);
  }

  async findOneById(
    timeId: number,
    projectId: number,
    user: User,
  ): Promise<Time> {
    await this.projectsService.findOneById(projectId, user);

    const time = await this.timeRepository.findOne({
      where: {
        id: timeId,
        project_id: projectId,
      },
    });

    if (!time) throw new NotFoundException('Time not found');

    return time;
  }

  async update(
    timeId: number,
    projectId: number,
    user: User,
    updateTimeDto: UpdateTimeDto,
  ): Promise<Time> {
    const { date, duration, description } = updateTimeDto;

    const time = await this.findOneById(timeId, projectId, user);

    if (date) time.date = new Date(date);
    if (duration) time.duration = duration;
    if (description) time.description = description;

    return await time.save();
  }

  async remove(timeId: number, projectId: number, user: User): Promise<void> {
    await this.projectsService.findOneById(projectId, user);

    const { affected } = await this.timeRepository.delete(timeId);

    if (affected === 0) throw new NotFoundException('User not found');
  }
}
