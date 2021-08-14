import { EntityRepository, Repository } from 'typeorm';
import { ClockEvent } from './clock-event.entity';
import { EventTypeEnum } from '../enums/event-type.enum';
import { Clock } from './clock.entity';
import { InternalServerErrorException } from '@nestjs/common';

@EntityRepository(ClockEvent)
export class ClockEventRepository extends Repository<ClockEvent> {
  async createEvent(
    eventType: EventTypeEnum,
    clock: Clock,
    date: Date,
  ): Promise<ClockEvent> {
    const event = new ClockEvent();
    event.clock = clock;
    event.type = eventType;
    event.date = date;

    try {
      await event.save();

      return event;
    } catch (err) {
      throw new InternalServerErrorException(
        'An error as occurred while creating a clock event',
      );
    }
  }

  async getEvents(clock: Clock): Promise<ClockEvent[]> {
    const query = this.createQueryBuilder('event');

    query.andWhere('event.clock_id = :clockId', { clockId: clock.id });

    return await query.getMany();
  }

  async resetEvents(clock: Clock): Promise<ClockEvent[]> {
    const events = await this.getEvents(clock);

    return await this.remove(events);
  }

  async getLastEvent(clock: Clock): Promise<ClockEvent> {
    const events = await this.getEvents(clock);

    return events
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .reverse()[0];
  }
}
