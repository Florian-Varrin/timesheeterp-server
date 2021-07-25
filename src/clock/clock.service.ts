import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateClockDto } from './dto/create-clock.dto';
import { UpdateClockDto } from './dto/update-clock.dto';
import { ClockRepository } from './entities/clock.repository';
import { Clock } from './entities/clock.entity';
import { User } from '../auth/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EventTypeEnum } from './enums/event-type.enum';
import { ClockEventRepository } from './entities/clock-event.repository';
import { ClockActionRepository } from './entities/clock-action.repository';
import { ActionTypeEnum } from './enums/action-type.enum';

@Injectable()
export class ClockService {
  constructor(
    @InjectRepository(ClockRepository)
    private clockRepository: ClockRepository,
    @InjectRepository(ClockEventRepository)
    private eventRepository: ClockEventRepository,
    @InjectRepository(ClockActionRepository)
    private actionRepository: ClockActionRepository,
  ) {}

  async create(createClockDto: CreateClockDto, user: User): Promise<Clock> {
    const clock = await this.clockRepository.createClock(createClockDto, user);

    const { is_main } = createClockDto;

    if (is_main) {
      user.main_clock_id = clock.id;

      await user.save();
    }

    return clock;
  }
  async findAll(userId: number): Promise<Clock[]> {
    const clocks = await this.clockRepository.getClocks(userId);

    const clocksWithTime = [];
    clocks.forEach((clock) => {
      clocksWithTime.push(this.calculateTime(clock));
    });

    return Promise.all(clocksWithTime);
  }

  async findOne(id: number, user: User): Promise<Clock> {
    const clock = await this.clockRepository.findOne({
      where: { id },
    });

    if (!clock) throw new NotFoundException('Clock not found');

    if (clock.user_id !== user.id)
      throw new ForbiddenException('You cannot access this clock');

    delete clock.user_id;
    delete clock.archived;

    return await this.calculateTime(clock);
  }

  async update(
    id: number,
    updateClockDto: UpdateClockDto,
    user: User,
  ): Promise<Clock> {
    const { name } = updateClockDto;

    const clock = await this.findOne(id, user);

    if (name) clock.name = name;

    await clock.save();

    delete clock.user_id;

    return await this.calculateTime(clock);
  }

  async remove(id: number, user: User): Promise<void> {
    const clock = await this.findOne(id, user);

    clock.archived = true;
    await clock.save();
  }

  async start(clockId: number, user: User): Promise<Clock> {
    const date = new Date();
    const clock = await this.findOne(clockId, user);

    const lastEvent = await this.eventRepository.getLastEvent(clock);

    if (lastEvent && lastEvent.type === EventTypeEnum.START) {
      throw new BadRequestException(`Clock ${clockId} already started`);
    }

    await this.eventRepository.createEvent(EventTypeEnum.START, clock, date);

    return this.calculateTime(clock);
  }

  async stop(clockId: number, user: User): Promise<Clock> {
    const date = new Date();
    const clock = await this.findOne(clockId, user);

    const lastEvent = await this.eventRepository.getLastEvent(clock);

    if (!lastEvent || lastEvent.type === EventTypeEnum.STOP) {
      throw new BadRequestException(`Clock ${clockId} already stopped`);
    }

    await this.eventRepository.createEvent(EventTypeEnum.STOP, clock, date);

    return this.calculateTime(clock);
  }

  async addTime(clockId: number, time: number, user: User): Promise<Clock> {
    const clock = await this.findOne(clockId, user);

    await this.actionRepository.createAction(ActionTypeEnum.ADD, clock, time);

    return this.calculateTime(clock);
  }

  async removeTime(clockId: number, time: number, user: User): Promise<Clock> {
    const clock = await this.findOne(clockId, user);

    await this.actionRepository.createAction(
      ActionTypeEnum.REMOVE,
      clock,
      time,
    );

    return this.calculateTime(clock);
  }

  async calculateTime(clock: Clock): Promise<Clock> {
    const events = await this.eventRepository.getEvents(clock);

    clock.events = events;
    const sortedEvents = events.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
    let current_time = 0;
    for (let i = 0; i < sortedEvents.length; i += 1) {
      if (!(sortedEvents[i].type === EventTypeEnum.START)) continue;

      const d1 = new Date(sortedEvents[i].date);
      const d2 = sortedEvents[i + 1]
        ? new Date(sortedEvents[i + 1].date)
        : new Date();

      const diff = (d2.getTime() - d1.getTime()) / 1000;
      current_time += diff;
    }

    const actions = await this.actionRepository.getActions(clock);

    clock.actions = actions;

    const actionsAverage = await this.actionRepository.calculateActionAverage(
      clock,
      actions,
    );

    current_time += actionsAverage;
    clock.current_time = Math.round(current_time);

    return clock;
  }
}
