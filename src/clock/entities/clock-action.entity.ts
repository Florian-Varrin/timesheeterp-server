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
import { ActionTypeEnum } from '../enums/action-type.enum';

@Entity()
export class ClockAction extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: ActionTypeEnum;

  // As second
  @Column()
  time: number;

  @ManyToOne((type) => Clock, (clock) => clock.events, { eager: false })
  @JoinColumn({ name: 'clock_id' })
  clock: Clock;

  @Column()
  clock_id: number;
}
