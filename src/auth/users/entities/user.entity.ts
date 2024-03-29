import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { SafeUserDto } from '../dto/safe-user.dto';
import { deepClone } from '../../../utils/deep-clone.util';
import { Project } from '../../../timesheet/projects/entities/project.entity';
import { RolesEnum } from '../../enums/roles.enum';
import { UserRole } from './user-role.entity';
import { FormattedUserRolesDto } from '../dto/formatted-user-roles.dto';
import { Clock } from '../../../clock/entities/clock.entity';

@Entity()
@Unique(['email'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @OneToMany((type) => UserRole, (userRole) => userRole.user, {
    eager: true,
  })
  roles: UserRole[];

  @OneToMany((type) => Project, (project) => project.user, { eager: true })
  projects: Project[];

  @OneToOne(() => Clock)
  @JoinColumn({ name: 'main_clock_id' })
  clock: Clock;

  @Column({ nullable: true })
  main_clock_id: number;

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);

    return hash === this.password;
  }

  hasOneRole(roles: RolesEnum[]): boolean {
    const { roles: userRoles } = this;

    const hasPermission = userRoles.some((role) => {
      const roleValue = (RolesEnum[role.role] as unknown) as number;
      return roles.includes(roleValue);
    });

    return hasPermission;
  }

  makeSafe(): SafeUserDto {
    const safeProperties = SafeUserDto.getProperties();

    const safeUser = deepClone(this) as SafeUserDto;
    for (const key in safeUser) {
      if (!safeProperties.includes(key)) delete safeUser[key];
    }

    safeUser.roles = (this.roles.map((role) => {
      return {
        id: role.id as number,
        role: role.role as string,
      };
    }) as unknown) as FormattedUserRolesDto;

    return <SafeUserDto>safeUser;
  }
}
