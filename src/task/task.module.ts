import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { ColumnModule } from 'src/column/column.module';
import { ProjectModule } from 'src/project/project.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { TaskService } from './task.service';

@Module({
  imports: [ColumnModule, ProjectModule],
  controllers: [TaskController],
  providers: [PrismaService, TaskService],
})
export class TaskModule {}
