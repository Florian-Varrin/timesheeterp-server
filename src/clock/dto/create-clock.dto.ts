import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsString,
  MaxLength,
  MinLength,
  IsOptional,
} from 'class-validator';

export class CreateClockDto {
  @ApiProperty()
  @IsString()
  @MinLength(2)
  @MaxLength(40)
  name: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  is_main: boolean;
}
