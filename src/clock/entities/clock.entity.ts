import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../auth/users/entities/user.entity';
import { ClockEvent } from './clock-event.entity';
import { ClockAction } from './clock-action.entity';

@Entity()
export class Clock extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  current_time_in_seconds: number;

  current_time_formatted: string;

  status: 'RUNNING' | 'STOPPED';

  @Column()
  archived: boolean;

  @ManyToOne((type) => User, (user) => user.projects, { eager: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  user_id: number;

  @OneToMany((type) => ClockEvent, (event) => event.clock, { eager: true })
  events: ClockEvent[];

  @OneToMany((type) => ClockAction, (action) => action.clock, { eager: true })
  actions: ClockAction[];
}
