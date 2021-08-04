import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  ValidationPipe,
  Patch,
  Delete,
  HttpCode, Query, BadRequestException,
} from '@nestjs/common';
import { ClockService } from './clock.service';
import { CreateClockDto } from './dto/create-clock.dto';
import { UpdateClockDto } from './dto/update-clock.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/decorators/get-users.decorator';
import { User } from '../auth/users/entities/user.entity';
import { Clock } from './entities/clock.entity';
import { CreateActionDto } from './dto/create-action.dto';

@Controller('clocks')
@ApiTags('clocks')
@ApiBearerAuth()
@UseGuards(AuthGuard())
export class ClockController {
  constructor(private readonly clockService: ClockService) {}

  @Post()
  @ApiOperation({ summary: 'Create a clock' })
  create(
    @Body(ValidationPipe) createClockDto: CreateClockDto,
    @GetUser() user: User,
  ): Promise<Clock> {
    return this.clockService.create(createClockDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all clocks for a user' })
  @ApiQuery({
    name: 'status',
    required: false,
    description: '"running" or "stopped"',
  })
  @ApiQuery({
    name: 'hydrated',
    required: false,
    description: 'show actions and events if true, "true" or "false"',
  })
  findAll(
    @GetUser() user: User,
    @Query('status') status = null,
    @Query('hydrated') hydrated = 'true',
  ): Promise<Clock[]> {
    if (status) this.clockService.checkStatus(status.toUpperCase());

    return this.clockService.findAll(
      user.id,
      status ? status.toUpperCase() : status,
      this.clockService.formatHydratedParameter(hydrated),
    );
  }

  @Get(':clockId')
  @ApiOperation({ summary: 'Get a clock' })
  @ApiQuery({
    name: 'hydrated',
    required: false,
    description: 'show actions and events if true, "true" or "false"',
  })
  findOne(
    @Param('clockId') clockId: string,
    @Query('hydrated') hydrated = 'true',
    @GetUser() user: User,
  ): Promise<Clock> {
    return this.clockService.findOne(
      +clockId,
      this.clockService.formatHydratedParameter(hydrated),
      user,
    );
  }

  @Patch(':clockId')
  @ApiOperation({ summary: 'Update a clock' })
  update(
    @Param('clockId') clockId: string,
    @Body() updateClockDto: UpdateClockDto,
    @GetUser() user: User,
  ) {
    return this.clockService.update(+clockId, updateClockDto, user);
  }

  @Delete(':clockId')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete a clock' })
  remove(
    @Param('clockId') clockId: string,
    @GetUser() user: User,
  ): Promise<void> {
    return this.clockService.remove(+clockId, user);
  }

  @Post(':clockId/start')
  start(
    @Param('clockId') clockId: string,
    @GetUser() user: User,
  ): Promise<Clock> {
    return this.clockService.start(+clockId, user);
  }

  @Post(':clockId/stop')
  stop(
    @Param('clockId') clockId: string,
    @GetUser() user: User,
  ): Promise<Clock> {
    return this.clockService.stop(+clockId, user);
  }

  @Post(':clockId/add')
  addTime(
    @Param('clockId') clockId: string,
    @Body() createActionDto: CreateActionDto,
    @GetUser() user: User,
  ): Promise<Clock> {
    const { time } = createActionDto;

    return this.clockService.addTime(+clockId, time, user);
  }

  @Post(':clockId/remove')
  removeTime(
    @Param('clockId') clockId: string,
    @Body() createActionDto: CreateActionDto,
    @GetUser() user: User,
  ): Promise<Clock> {
    const { time } = createActionDto;

    return this.clockService.removeTime(+clockId, time, user);
  }

  @Post(':clockId/reset')
  reset(
    @Param('clockId') clockId: string,
    @GetUser() user: User,
  ): Promise<Clock> {
    return this.clockService.reset(+clockId, user);
  }
}
