import { EntityRepository, Repository } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { Time } from './time.entity';
import { CreateTimeDto } from '../dto/create-time.dto';
import { Project } from '../../projects/entities/project.entity';
import { TimesFilterDto } from '../dto/times-filter.dto';

@EntityRepository(Time)
export class TimeRepository extends Repository<Time> {
  async getTimes(
    projectId: number,
    timesFilterDto: TimesFilterDto,
  ): Promise<Time[]> {
    const { start_date: startDate, end_date: endDate } = timesFilterDto;

    const query = this.createQueryBuilder('time');

    query.andWhere('time.project_id = :projectId', { projectId });

    if (startDate) query.andWhere('time.date >= :startDate', { startDate });
    if (endDate) query.andWhere('time.date <= :endDate', { endDate });

    const times = await query.getMany();

    return times;
  }

  async createTime(
    createTimeDto: CreateTimeDto,
    project: Project,
  ): Promise<Time> {
    const { date, duration, description } = createTimeDto;

    const time = new Time();
    time.date = new Date(date);
    time.duration = +duration;
    time.description = description;
    time.project = project;

    try {
      await time.save();

      delete time.project_id;

      return time;
    } catch (err) {
      throw new InternalServerErrorException(
        'An error as occurred while creating a time',
      );
    }
  }
}
