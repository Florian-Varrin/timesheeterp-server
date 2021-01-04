import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfigOptions } from './config/typeorm.config';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfigOptions)],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
