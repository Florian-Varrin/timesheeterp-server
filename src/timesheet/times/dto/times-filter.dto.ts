import { IsFormatedDate } from '../decorators/is-formated-date-validator.decorators';

export class TimesFilterDto {
  @IsFormatedDate()
  start_date: string;

  @IsFormatedDate()
  end_date: string;
}
