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

@Controller('projects/:projectId/times')
@UseGuards(AuthGuard())
export class TimesController {
  constructor(private readonly timesService: TimesService) {}

  @Post()
  create(
    @Body(ValidationPipe) createTimeDto: CreateTimeDto,
    @Param('projectId') projectId: string,
    @GetUser() user: User,
  ): Promise<Time> {
    return this.timesService.create(createTimeDto, +projectId, user);
  }

  @Get()
  findAll(
    @Param('projectId') projectId: string,
    @GetUser() user: User,
    @Query() timesFilterDto: TimesFilterDto,
  ): Promise<Time[]> {
    return this.timesService.findAll(+projectId, user, timesFilterDto);
  }

  @Get(':timeId')
  findOne(
    @Param('timeId') timeId: string,
    @Param('projectId') projectId: string,
    @GetUser() user: User,
  ): Promise<Time> {
    return this.timesService.findOne(+timeId, +projectId, user);
  }

  @Patch(':timeId')
  update(
    @Param('timeId') timeId: string,
    @Param('projectId') projectId: string,
    @GetUser() user: User,
    @Body() updateTimeDto: UpdateTimeDto,
  ): Promise<Time> {
    return this.timesService.update(+timeId, +projectId, user, updateTimeDto);
  }

  @Delete(':timeId')
  @HttpCode(204)
  remove(
    @Param('timeId') timeId: string,
    @Param('projectId') projectId: string,
    @GetUser() user: User,
  ): Promise<void> {
    return this.timesService.remove(+timeId, +projectId, user);
  }
}
