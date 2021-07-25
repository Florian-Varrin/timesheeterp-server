import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsNumber } from 'class-validator';
import { Clock } from '../../../clock/entities/clock.entity';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsNumber()
  main_clock: Clock;
}
