import { IsNumber, IsString, MaxLength, Min, MinLength } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @MinLength(2)
  @MaxLength(10)
  name: string;

  @IsNumber()
  @Min(0)
  hour_rate: number;
}
