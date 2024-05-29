import { DeleteTaskDto } from './dto/delete-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) {}

  async updateTask(task: UpdateTaskDto) {
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

  async deleteTask(task: DeleteTaskDto) {
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

  async addTaskToProject(task: CreateTaskDto) {
    const column = await this.prisma.column.findFirst({
      where: {
        id: task.columnId,
      },
      include: {
        tasks: true,
      },
    });

    const order = column.tasks.reduce(
      (acc, col) => (acc > col.order ? acc : col.order + 1),
      1,
    );

    return await this.prisma.task.create({
      data: {
        title: task.title,
        columnId: column.id,
        order: order,
      },
    });
  }
}
