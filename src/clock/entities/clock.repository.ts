import { EntityRepository, Repository } from 'typeorm';
import { Clock } from './clock.entity';
import { CreateClockDto } from '../dto/create-clock.dto';
import { User } from '../../auth/users/entities/user.entity';
import { InternalServerErrorException } from '@nestjs/common';

@EntityRepository(Clock)
export class ClockRepository extends Repository<Clock> {
  async getClocks(userId: number): Promise<Clock[]> {
    const query = this.createQueryBuilder('clock');

    query.andWhere('clock.user_id = :userId', { userId });
    query.andWhere('clock.archived = false');

    const clocks = await query.getMany();

    return clocks.map((clock) => {
      delete clock.user_id;
      delete clock.archived;

      return clock;
    });
  }

  async createClock(
    createClockDto: CreateClockDto,
    user: User,
  ): Promise<Clock> {
    const { name } = createClockDto;

    const clock = new Clock();
    clock.name = name;
    clock.archived = false;
    clock.user = user;
    clock.current_time_in_seconds = 0;

    try {
      await clock.save();

      delete clock.user;
      delete clock.archived;

      return clock;
    } catch (err) {
      throw new InternalServerErrorException(
        'An error as occurred while creating a clock',
      );
    }
  }
}
