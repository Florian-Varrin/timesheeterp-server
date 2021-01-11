import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { SafeUserDto } from '../dto/safe-user.dto';
import { deepClone } from '../../../utils/deep-clone.util';
import { Role } from '../../roles/entities/role.entity';

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

  @ManyToMany(() => Role)
  @JoinTable()
  roles: Role[];

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);

    return hash === this.password;
  }

  hasOneRole(roles: string[]): boolean {
    const { roles: userRoles } = this;

    roles = roles.map((role) => role.toUpperCase());

    return userRoles.some((userRole) => roles.includes(userRole.name));
  }

  makeSafe(): SafeUserDto {
    const safeProperties = SafeUserDto.getProperties();

    const safeUser = deepClone(this);
    for (const key in safeUser) {
      if (!safeProperties.includes(key)) delete safeUser[key];
    }

    return <SafeUserDto>safeUser;
  }
}
