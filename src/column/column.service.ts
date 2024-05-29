import { EditColumnDto } from './dto/edit-column.dto';
import { PrismaService } from './../prisma/prisma.service';
import { CreateColumnDto } from './dto/create-column.dto';
import { Injectable, BadRequestException } from '@nestjs/common';
import { DeleteColumnDto } from './dto/delete-column.dto';
import { ChangeColumnOrderDto } from './dto/change-order-column.dto';

@Injectable()
export class ColumnService {
  constructor(private readonly prisma: PrismaService) {}

  async editColumn(editColumnDto: EditColumnDto) {
    const updatedColumn = await this.prisma.column.update({
      data: {
        title: editColumnDto.title,
      },
      where: {
        id: editColumnDto.id,
      },
    });

    return updatedColumn;
  }

  async createColumn(createColumnDto: CreateColumnDto) {
    const project = await this.prisma.project.findUnique({
      where: {
        id: createColumnDto.projectId,
      },
      include: {
        columns: true,
      },
    });

    if (!project) throw new BadRequestException('Project does not exist');

    const order = project.columns.reduce(
      (acc, column) => (acc > column.order ? acc : column.order + 1),
      1,
    );

    const column = await this.prisma.column.create({
      data: {
        projectId: project.id,
        title: createColumnDto.title,
        order: order,
      },
    });

    return column;
  }

  async deleteColumn({ id, projectId }: DeleteColumnDto) {
    const deletedColumn = await this.prisma.column.delete({
      where: {
        id,
      },
    });

    const [columnsToUpdate] = await this.prisma.$transaction([
      this.prisma.column.findMany({
        where: {
          projectId,
          order: {
            gt: deletedColumn.order,
          },
        },
      }),
    ]);

    const updatedColumns = columnsToUpdate.map((column) =>
      this.prisma.column.update({
        where: {
          id: column.id,
        },
        data: {
          order: column.order - 1,
        },
      }),
    );

    return await this.prisma.$transaction(updatedColumns);
  }

  async changeColumnOrder(changeColumnOrderDto: ChangeColumnOrderDto) {
    const column = await this.prisma.column.findFirst({
      where: {
        id: changeColumnOrderDto.id,
      },
    });


    if (column.order > changeColumnOrderDto.newOrder) {
      const columnsToUpdate = await this.prisma.column.findMany({
        where: {
          order: {
            gte: changeColumnOrderDto.newOrder,
            lt: column.order,
          },
        },
      });

      const updatedColumnsPromises = columnsToUpdate.map((col) =>
        this.prisma.column.update({
          where: { id: col.id },
          data: {
            order: col.order + 1,
          },
        }),
      );

      await this.prisma.$transaction(updatedColumnsPromises);
    }

    if (column.order < changeColumnOrderDto.newOrder) {
      const columnsToUpdate = await this.prisma.column.findMany({
        where: {
          order: {
            gt: column.order,
            lte: changeColumnOrderDto.newOrder,
          },
        },
      });

      const updatedColumnsPromises = await columnsToUpdate.map((col) =>
        this.prisma.column.update({
          where: { id: col.id },
          data: {
            order: col.order - 1,
          },
        }),
      );

      await this.prisma.$transaction(updatedColumnsPromises);
    }

    const updatedColumn = this.prisma.column.update({
      where: {
        id: changeColumnOrderDto.id,
      },
      data: { order: changeColumnOrderDto.newOrder },
    });

    return updatedColumn;
  }

  async findColumnByIdWithProject(columnId) {
    return await this.prisma.column.findFirst({
      where: {
        id: columnId,
      },
      include: {
        project: {
          include: {
            collaborators: true,
          },
        },
      },
    });
  }
}
