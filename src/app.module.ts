import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfigOptions } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { TimesheetModule } from './timesheet/timesheet.module';
import { DocumentationModule } from './documentation/documentation.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfigOptions),
    AuthModule,
    TimesheetModule,
    DocumentationModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
