import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfigOptions } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { TimesheetModule } from './timesheet/timesheet.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfigOptions),
    AuthModule,
    TimesheetModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
