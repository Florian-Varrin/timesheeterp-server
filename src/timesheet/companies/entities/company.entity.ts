import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from '../../../auth/users/entities/user.entity';
import { Time } from '../../times/entities/time.entity';

@Entity()
@Unique(['name'])
export class Company extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  hour_rate: number;

  @Column()
  archived: boolean;

  @ManyToOne((type) => User, (user) => user.companies, { eager: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany((type) => Time, (time) => time.company, { eager: false })
  times: Time[];

  @Column()
  user_id: number;
}
