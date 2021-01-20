import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Project } from '../../projects/entities/project.entity';

@Entity()
export class Time extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'float' })
  duration: number;

  @Column()
  description: string;

  @ManyToOne((type) => Project, (project) => project.times, { eager: false })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @Column()
  project_id: number;
}
