import { Module } from '@nestjs/common';
import { ColumnService } from 'src/column/column.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { TaskService } from 'src/task/task.service';

@Module({
  controllers: [ProjectController],
  providers: [
    ProjectService,
    PrismaService,
    UserService,
    TaskService,
    ColumnService,
  ],
})
export class ProjectModule {}
