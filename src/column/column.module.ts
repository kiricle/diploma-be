import { PrismaService } from './../prisma/prisma.service';
import { Module } from '@nestjs/common';
import { ProjectModule } from './../project/project.module';
import { ColumnController } from './column.controller';
import { ColumnService } from './column.service';

@Module({
  imports: [ProjectModule],
  controllers: [ColumnController],
  providers: [ColumnService, PrismaService],
  exports: [ColumnService],
})
export class ColumnModule {}
