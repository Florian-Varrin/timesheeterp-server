import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EventTypeEnum } from '../enums/event-type.enum';
import { Clock } from './clock.entity';

@Entity()
export class ClockEvent extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: EventTypeEnum;

  @Column()
  date: Date;

  @ManyToOne((type) => Clock, (clock) => clock.events, { eager: false })
  @JoinColumn({ name: 'clock_id' })
  clock: Clock;

  @Column()
  clock_id: number;
}
