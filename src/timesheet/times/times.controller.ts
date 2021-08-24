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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

@Controller('projects/:projectId/times')
@ApiTags('times')
@ApiBearerAuth()
@UseGuards(AuthGuard())
export class TimesController {
  constructor(private readonly timesService: TimesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a time for a project' })
  create(
    @Body(ValidationPipe) createTimeDto: CreateTimeDto,
    @Param('projectId') projectId: string,
    @GetUser() user: User,
  ): Promise<Time> {
    return this.timesService.create(createTimeDto, +projectId, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all times for a project' })
  @ApiQuery({
    name: 'start_date',
    required: false,
    description: 'from this date in YYYY-MM-DD format',
  })
  @ApiQuery({
    name: 'end_date',
    required: false,
    description: 'until this date in YYYY-MM-DD format',
  })
  findAll(
    @Param('projectId') projectId: string,
    @GetUser() user: User,
    @Query() timesFilterDto: TimesFilterDto,
  ): Promise<Time[]> {
    return this.timesService.findAll(+projectId, user, timesFilterDto);
  }

  @Get(':timeId')
  @ApiOperation({ summary: 'Get a time' })
  findOne(
    @Param('timeId') timeId: string,
    @Param('projectId') projectId: string,
    @GetUser() user: User,
  ): Promise<Time> {
    return this.timesService.findOneById(+timeId, +projectId, user);
  }

  @Patch(':timeId')
  @ApiOperation({ summary: 'Update a time' })
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
  @ApiOperation({ summary: 'Delete a time' })
  remove(
    @Param('timeId') timeId: string,
    @Param('projectId') projectId: string,
    @GetUser() user: User,
  ): Promise<void> {
    return this.timesService.remove(+timeId, +projectId, user);
  }
}
