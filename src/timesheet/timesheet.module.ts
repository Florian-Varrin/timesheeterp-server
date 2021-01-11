import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { CompaniesModule } from './companies/companies.module';
import { TimesModule } from './times/times.module';

@Module({
  imports: [CompaniesModule, AuthModule, TimesModule],
})
export class TimesheetModule {}
