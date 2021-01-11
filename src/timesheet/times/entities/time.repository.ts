import { EntityRepository, Repository } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { Time } from './time.entity';
import { CreateTimeDto } from '../dto/create-time.dto';
import { Company } from '../../companies/entities/company.entity';
import { TimesFilterDto } from '../dto/times-filter.dto';

@EntityRepository(Time)
export class TimeRepository extends Repository<Time> {
  async getTimes(
    companyId: number,
    timesFilterDto: TimesFilterDto,
  ): Promise<Time[]> {
    const { start_date: startDate, end_date: endDate } = timesFilterDto;

    const query = this.createQueryBuilder('time');

    query.andWhere('time.company_id = :companyId', { companyId });

    if (startDate) query.andWhere('time.date >= :startDate', { startDate });
    if (endDate) query.andWhere('time.date <= :endDate', { endDate });

    const times = await query.getMany();

    return times;
  }

  async createTime(
    createTimeDto: CreateTimeDto,
    company: Company,
  ): Promise<Time> {
    const { date, duration, description } = createTimeDto;

    const time = new Time();
    time.date = new Date(date);
    time.duration = +duration;
    time.description = description;
    time.company = company;

    try {
      await time.save();

      delete time.company_id;

      return time;
    } catch (err) {
      throw new InternalServerErrorException(
        'An error as occurred while creating a time',
      );
    }
  }
}
