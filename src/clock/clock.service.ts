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
import { StatusType } from './types/status.type';

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
  async findAll(
    userId: number,
    status?: StatusType,
    hydrated = true,
  ): Promise<Clock[]> {
    const clocks = await this.clockRepository.getClocks(userId);

    const clocksWithTime = [];
    for (const clock of clocks) {
      const clockWithTime = await this.calculateTime(clock, hydrated);
      if (!status || clockWithTime.status === status)
        clocksWithTime.push(clockWithTime);
    }

    return Promise.all(clocksWithTime);
  }

  async findOneById(id: number, hydrated = true, user: User): Promise<Clock> {
    const clock = await this.clockRepository.findOne({
      where: { id },
    });

    if (!clock) throw new NotFoundException('Clock not found');

    if (clock.user_id !== user.id)
      throw new ForbiddenException('You cannot access this clock');

    delete clock.user_id;
    delete clock.archived;

    return await this.calculateTime(clock, hydrated);
  }

  async update(
    id: number,
    updateClockDto: UpdateClockDto,
    user: User,
  ): Promise<Clock> {
    const { name } = updateClockDto;

    const clock = await this.findOneById(id, false, user);

    if (name) clock.name = name;

    await clock.save();

    delete clock.user_id;

    return await this.calculateTime(clock);
  }

  async remove(id: number, user: User): Promise<void> {
    const clock = await this.findOneById(id, false, user);

    clock.archived = true;
    await clock.save();
  }

  async start(clockId: number, user: User): Promise<Clock> {
    const date = new Date();
    const clock = await this.findOneById(clockId, false, user);

    const lastEvent = await this.eventRepository.getLastEvent(clock);

    if (!lastEvent || lastEvent.type === EventTypeEnum.STOP) {
      await this.eventRepository.createEvent(EventTypeEnum.START, clock, date);
    }

    return this.calculateTime(clock);
  }

  async stop(clockId: number, user: User): Promise<Clock> {
    const date = new Date();
    const clock = await this.findOneById(clockId, false, user);

    const lastEvent = await this.eventRepository.getLastEvent(clock);

    if (lastEvent && lastEvent.type === EventTypeEnum.START) {
      await this.eventRepository.createEvent(EventTypeEnum.STOP, clock, date);
    }

    return this.calculateTime(clock);
  }

  async addTime(clockId: number, time: number, user: User): Promise<Clock> {
    const clock = await this.findOneById(clockId, false, user);

    await this.actionRepository.createAction(ActionTypeEnum.ADD, clock, time);

    return this.calculateTime(clock);
  }

  async removeTime(clockId: number, time: number, user: User): Promise<Clock> {
    const clock = await this.findOneById(clockId, false, user);

    await this.actionRepository.createAction(
      ActionTypeEnum.REMOVE,
      clock,
      time,
    );

    return this.calculateTime(clock);
  }

  async reset(clockId: number, user: User): Promise<Clock> {
    const clock = await this.findOneById(clockId, false, user);

    await Promise.all([
      this.eventRepository.resetEvents(clock),
      this.actionRepository.resetActions(clock),
    ]);

    return this.calculateTime(clock);
  }

  async calculateTime(clock: Clock, hydrated = false): Promise<Clock> {
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

    const lastEvent = sortedEvents[sortedEvents.length - 1];

    clock.status =
      !lastEvent || lastEvent.type === EventTypeEnum.STOP
        ? 'STOPPED'
        : 'RUNNING';

    const actions = await this.actionRepository.getActions(clock);

    clock.actions = actions;

    const actionsAverage = await this.actionRepository.calculateActionAverage(
      clock,
      actions,
    );

    current_time += actionsAverage;
    current_time = Math.round(current_time);
    clock.current_time_in_seconds = current_time;
    clock.current_time_formatted = this.formatTime(current_time);

    if (!hydrated) {
      delete clock.actions;
      delete clock.events;
    }

    return clock;
  }

  formatTime(time: number): string {
    let minutesNumber: number = Math.floor(time / 60);

    let hoursNumber = 0;
    if (minutesNumber > 60) {
      hoursNumber = Math.floor(minutesNumber / 60);

      minutesNumber -= hoursNumber * 60;
    }

    const secondsNumber: number =
      time - (hoursNumber * 60 * 60 + minutesNumber * 60);

    const hoursString =
      hoursNumber < 10 ? `0${hoursNumber}` : hoursNumber.toString();

    const minutesString =
      minutesNumber < 10 ? `0${minutesNumber}` : minutesNumber.toString();

    const secondsString =
      secondsNumber < 10 ? `0${secondsNumber}` : secondsNumber.toString();

    return `${hoursString}:${minutesString}:${secondsString}`;
  }

  checkStatus(status) {
    if (status !== 'RUNNING' && status !== 'STOPPED')
      throw new BadRequestException(
        'status must be either "running" or "stopped"',
      );
  }

  formatHydratedParameter(hydrated: string): boolean {
    if (hydrated !== 'true' && hydrated !== 'false')
      throw new BadRequestException(
        'hydrated must be either "true" or "false"',
      );

    return hydrated === 'true';
  }
}
