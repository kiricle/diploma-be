import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';

@Module({
  controllers: [ProjectController],
  providers: [ProjectService, PrismaService, UserService],
  exports: [ProjectService],
})
export class ProjectModule {}
