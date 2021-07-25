import { Module } from '@nestjs/common';
import { ClockService } from './clock.service';
import { ClockController } from './clock.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClockRepository } from './entities/clock.repository';
import { AuthModule } from '../auth/auth.module';
import { ClockEventRepository } from './entities/clock-event.repository';
import { ClockActionRepository } from './entities/clock-action.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClockRepository]),
    TypeOrmModule.forFeature([ClockEventRepository]),
    TypeOrmModule.forFeature([ClockActionRepository]),
    AuthModule,
  ],
  controllers: [ClockController],
  providers: [ClockService],
  exports: [ClockService],
})
export class ClockModule {}
