import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ValidationPipe,
  Query,
  HttpCode,
} from '@nestjs/common';
import { TimesService } from './times.service';
import { CreateTimeDto } from './dto/create-time.dto';
import { UpdateTimeDto } from './dto/update-time.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../../auth/decorators/get-users.decorator';
import { User } from '../../auth/users/entities/user.entity';
import { Time } from './entities/time.entity';
import { TimesFilterDto } from './dto/times-filter.dto';

@Controller('companies/:companyId/times')
@UseGuards(AuthGuard())
export class TimesController {
  constructor(private readonly timesService: TimesService) {}

  @Post()
  create(
    @Body(ValidationPipe) createTimeDto: CreateTimeDto,
    @Param('companyId') companyId: string,
    @GetUser() user: User,
  ): Promise<Time> {
    return this.timesService.create(createTimeDto, +companyId, user);
  }

  @Get()
  findAll(
    @Param('companyId') companyId: string,
    @GetUser() user: User,
    @Query() timesFilterDto: TimesFilterDto,
  ) {
    return this.timesService.findAll(+companyId, user, timesFilterDto);
  }

  @Get(':timeId')
  findOne(
    @Param('timeId') timeId: string,
    @Param('companyId') companyId: string,
    @GetUser() user: User,
  ) {
    return this.timesService.findOne(+timeId, +companyId, user);
  }

  @Patch(':timeId')
  update(
    @Param('timeId') timeId: string,
    @Param('companyId') companyId: string,
    @GetUser() user: User,
    @Body() updateTimeDto: UpdateTimeDto,
  ) {
    return this.timesService.update(+timeId, +companyId, user, updateTimeDto);
  }

  @Delete(':timeId')
  @HttpCode(204)
  remove(
    @Param('timeId') timeId: string,
    @Param('companyId') companyId: string,
    @GetUser() user: User,
  ) {
    return this.timesService.remove(+timeId, +companyId, user);
  }
}
