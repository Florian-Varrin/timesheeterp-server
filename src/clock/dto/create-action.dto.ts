import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateActionDto {
  @ApiProperty()
  @IsNumber()
  time: number;
}
