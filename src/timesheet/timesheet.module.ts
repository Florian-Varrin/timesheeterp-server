import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { TimesModule } from './times/times.module';

@Module({
  imports: [ProjectsModule, AuthModule, TimesModule],
})
export class TimesheetModule {}
