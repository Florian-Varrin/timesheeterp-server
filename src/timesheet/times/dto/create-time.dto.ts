import { IsNumber, IsString, Min, MinLength } from 'class-validator';
import { IsFormatedDate } from '../decorators/is-formated-date-validator.decorators';
import { IsMultipleOf } from '../decorators/is-divisable-by.decorators';

export class CreateTimeDto {
  @IsFormatedDate()
  date: string;

  @IsNumber()
  @Min(0.25)
  @IsMultipleOf(0.25)
  duration: number;

  @IsString()
  @MinLength(0)
  description: string;
}
