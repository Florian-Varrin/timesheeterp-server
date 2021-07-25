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
  HttpCode,
} from '@nestjs/common';
import { ClockService } from './clock.service';
import { CreateClockDto } from './dto/create-clock.dto';
import { UpdateClockDto } from './dto/update-clock.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
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
  findAll(@GetUser() user: User): Promise<Clock[]> {
    return this.clockService.findAll(user.id);
  }

  @Get(':clockId')
  @ApiOperation({ summary: 'Get a clock' })
  findOne(
    @Param('clockId') clockId: string,
    @GetUser() user: User,
  ): Promise<Clock> {
    return this.clockService.findOne(+clockId, user);
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
}
