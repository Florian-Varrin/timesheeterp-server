import { IsNumber, IsString, Min, MinLength } from 'class-validator';
import { IsFormatedDate } from '../decorators/is-formated-date-validator.decorators';
import { IsMultipleOf } from '../decorators/is-divisable-by.decorators';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTimeDto {
  @ApiProperty({
    format: 'YYYY-MM-DD',
    example: '2021-01-05',
  })
  @IsFormatedDate()
  date: string;

  @ApiProperty({
    description: 'has to be a multiple of 0.25',
    minimum: 0.25,
    example: 0.75,
  })
  @IsNumber()
  @Min(0.25)
  @IsMultipleOf(0.25)
  duration: number;

  @ApiProperty()
  @IsString()
  @MinLength(0)
  description: string;
}
