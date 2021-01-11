import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTimeDto } from './dto/create-time.dto';
import { UpdateTimeDto } from './dto/update-time.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CompaniesService } from '../companies/companies.service';
import { User } from '../../auth/users/entities/user.entity';
import { TimeRepository } from './entities/time.repository';
import { Time } from './entities/time.entity';
import { TimesFilterDto } from './dto/times-filter.dto';

@Injectable()
export class TimesService {
  constructor(
    @InjectRepository(TimeRepository)
    private timeRepository: TimeRepository,
    private companiesService: CompaniesService,
  ) {}

  async create(
    createTimeDto: CreateTimeDto,
    companyId: number,
    user: User,
  ): Promise<Time> {
    const company = await this.companiesService.findOne(companyId, user);

    return this.timeRepository.createTime(createTimeDto, company);
  }

  async findAll(
    companyId: number,
    user: User,
    timesFilterDto: TimesFilterDto,
  ): Promise<Time[]> {
    const times = await this.timeRepository.getTimes(companyId, timesFilterDto);

    // if no times, check if company exist, if not, 404 or 403 on company
    if (times.length === 0)
      await this.companiesService.findOne(companyId, user);

    return times;
  }

  async findOne(timeId: number, companyId: number, user: User): Promise<Time> {
    await this.companiesService.findOne(companyId, user);

    const time = await this.timeRepository.findOne({
      where: {
        id: timeId,
        company_id: companyId,
      },
    });

    if (!time) throw new NotFoundException('Time not found');

    return time;
  }

  async update(
    timeId: number,
    companyId: number,
    user: User,
    updateTimeDto: UpdateTimeDto,
  ) {
    const { date, duration, description } = updateTimeDto;

    const time = await this.findOne(timeId, companyId, user);

    if (date) time.date = new Date(date);
    if (duration) time.duration = duration;
    if (description) time.description = description;

    return await time.save();
  }

  async remove(timeId: number, companyId: number, user: User) {
    await this.companiesService.findOne(companyId, user);

    const { affected } = await this.timeRepository.delete(timeId);

    if (affected === 0) throw new NotFoundException('User not found');
  }
}
