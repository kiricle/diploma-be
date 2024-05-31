import { ProjectService } from './../project/project.service';
import { DeleteTaskDto } from './dto/delete-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { ColumnService } from 'src/column/column.service';

@Injectable()
export class TaskService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly columnService: ColumnService,
    private readonly projectService: ProjectService,
  ) {}

  async createTask(userId: number, task: CreateTaskDto) {
    const column = await this.columnService.findColumnByIdWithProject(
      task.columnId,
    );

    if (!column) throw new BadRequestException('There is no such column');

    if (!this.projectService.isProjectMember(userId, column.project))
      throw new BadRequestException('The user is not a member');

    const order = column.tasks.reduce(
      (acc, col) => (acc > col.order ? acc : col.order + 1),
      1,
    );

    const createdTask = await this.prisma.task.create({
      data: {
        ...task,
        order,
      },
    });

    return createdTask;
  }

  async updateTask(userId: number, task: UpdateTaskDto) {
    const column = await this.columnService.findColumnByIdWithProject(
      task.columnId,
    );

    if (!column) throw new BadRequestException('There is no such column');

    if (!this.projectService.isProjectMember(userId, column.project))
      throw new BadRequestException('The user is not a member');

    const updatedTask = await this.prisma.task.update({
      data: {
        title: task.title,
        description: task.description,
        updatedAt: new Date(),
      },
      where: {
        id: task.id,
      },
    });

    return updatedTask;
  }

  async deleteTask(userId: number, task: DeleteTaskDto) {
    const column = await this.columnService.findColumnByIdWithProject(
      task.columnId,
    );

    if (!column) throw new BadRequestException('There is no such column');

    if (!this.projectService.isProjectMember(userId, column.project))
      throw new BadRequestException('The user is not a member');

    const deletedTask = await this.prisma.task.delete({
      where: {
        id: task.id,
      },
    });

    const [tasksToUpdate] = await this.prisma.$transaction([
      this.prisma.task.findMany({
        where: {
          columnId: task.columnId,
          order: {
            gt: deletedTask.order,
          },
        },
      }),
    ]);

    const updatedTasks = tasksToUpdate.map((column) =>
      this.prisma.column.update({
        where: {
          id: column.id,
        },
        data: {
          order: column.order - 1,
        },
      }),
    );

    return await this.prisma.$transaction(updatedTasks);
  }
}
