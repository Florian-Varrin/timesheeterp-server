import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { CompaniesModule } from './companies/companies.module';

@Module({
  imports: [CompaniesModule, AuthModule],
})
export class TimesheetModule {}
