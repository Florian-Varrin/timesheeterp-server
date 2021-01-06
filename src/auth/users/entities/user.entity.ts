import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { SafeUserDto } from '../dto/safe-user.dto';
import { deepClone } from '../../../utils/deep-clone.util';

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

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);

    return hash === this.password;
  }

  makeSafe(user: User): SafeUserDto {
    const safeProperties = SafeUserDto.getProperties();

    const safeUser = deepClone(this);
    for (const key in safeUser) {
      if (!safeProperties.includes(key)) delete safeUser[key];
    }

    return <SafeUserDto>safeUser;
  }
}
