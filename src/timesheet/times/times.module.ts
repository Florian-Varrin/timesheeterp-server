import { Module } from '@nestjs/common';
import { TimesService } from './times.service';
import { TimesController } from './times.controller';
import { AuthModule } from '../../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeRepository } from './entities/time.repository';
import { ProjectsModule } from '../projects/projects.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TimeRepository]),
    AuthModule,
    ProjectsModule,
  ],
  controllers: [TimesController],
  providers: [TimesService],
})
export class TimesModule {}
