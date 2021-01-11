import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Company } from '../../companies/entities/company.entity';

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

  @ManyToOne((type) => Company, (company) => company.times, { eager: false })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column()
  company_id: number;
}
