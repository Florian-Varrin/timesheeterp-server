import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { AuthModule } from '../../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectRepository } from './entities/project.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectRepository]), AuthModule],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
