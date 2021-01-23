import { IsNumber, IsString, MaxLength, Min, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty()
  @IsString()
  @MinLength(2)
  @MaxLength(10)
  name: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  hour_rate: number;
}
