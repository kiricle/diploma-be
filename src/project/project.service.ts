import { DeleteTaskDto } from './../task/dto/delete-task.dto';
import { EditColumnDto } from './../column/dto/edit-column.dto';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ColumnService } from 'src/column/column.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateColumnDto } from './../column/dto/create-column.dto';
import { UserService } from './../user/user.service';
import { AddCollaboratorDto } from './dto/add-collaborator.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CreateTaskDto } from 'src/task/dto/create-task.dto';
import { TaskService } from 'src/task/task.service';
import { DeleteColumnDto } from 'src/column/dto/delete-column.dto';
import { UpdateTaskDto } from 'src/task/dto/update-task.dto';
import { ChangeColumnOrderDto } from 'src/column/dto/change-order-column.dto';

@Injectable()
export class ProjectService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly columnService: ColumnService,
    private readonly taskService: TaskService,
  ) {}

  async create(masterId: number, { name }: CreateProjectDto) {
    return await this.prisma.project.create({
      data: {
        name: name,
        masterId: masterId,
      },
    });
  }

  async updateProjectName(
    currentUserId: number,
    { id, name }: UpdateProjectDto,
  ) {
    const project = await this.findProjectById(id);

    if (!project) throw new BadRequestException('Project does not exist');

    if (currentUserId !== project.masterId)
      throw new ForbiddenException('Only owner can change project');

    if (project.name === name)
      throw new BadRequestException('Project name is the same as the new name');

    const updatedProject = await this.prisma.project.update({
      where: {
        id: id,
      },
      data: {
        name,
      },
    });

    return updatedProject;
  }

  async addCollaborator(
    currentUserId: number,
    { id, collaboratorEmail }: AddCollaboratorDto,
  ) {
    const project = await this.findProjectWithCollaboratorsById(id);

    if (!project) throw new BadRequestException('Project does not exist');
    if (currentUserId !== project.masterId)
      throw new ForbiddenException('Only owner can add collaborators');

    const user = await this.userService.getByEmail(collaboratorEmail);

    if (!user) throw new BadRequestException('Collaborator does not exist');

    const isAlreadyCollaborator = project.collaborators.find(
      (collaborator) => user.id === collaborator.id,
    );
    if (isAlreadyCollaborator)
      throw new BadRequestException('User is already a collaborator');

    const updatedProject = await this.addCollaboratorToProjectById(user.id, id);

    return updatedProject;
  }

  async createTask(userId: number, task: CreateTaskDto) {
    const column = await this.columnService.findColumnByIdWithProject(
      task.columnId,
    );

    if (!column) throw new BadRequestException('Column does not exists');

    if (!this.isProjectMember(userId, column.project))
      throw new ForbiddenException('User is not a member of the project');

    const createdTask = await this.taskService.addTaskToProject(task);

    return createdTask;
  }

  async updateTask(userId: number, task: UpdateTaskDto) {
    const column = await this.columnService.findColumnByIdWithProject(
      task.columnId,
    );

    if (!column) throw new BadRequestException('Column does not exists');

    if (!this.isProjectMember(userId, column.project))
      throw new ForbiddenException('User is not a member of the project');

    const updatedTask = await this.taskService.updateTask(task);

    return updatedTask;
  }

  async deleteTask(userId: number, task: DeleteTaskDto) {
    const column = await this.columnService.findColumnByIdWithProject(
      task.columnId,
    );

    if (!column) throw new BadRequestException('Column does not exists');

    if (!this.isProjectMember(userId, column.project))
      throw new ForbiddenException('User is not a member of the project');

    const deletedTask = await this.taskService.deleteTask(task);

    return deletedTask;
  }

  async getOwnProjectsByUserId(userId: number) {
    const user = await this.userService.getById(userId);

    if (!user) throw new BadRequestException('User does not exist');

    const projects = await this.prisma.project.findMany({
      where: {
        masterId: user.id,
      },
    });

    return projects;
  }

  async getCollaboratingProjectsByUserId(userId: number) {
    const user = await this.userService.getById(userId);

    if (!user) throw new BadRequestException('User does not exist');

    const projects = await this.prisma.project.findMany({
      where: {
        collaborators: {
          some: {
            id: userId,
          },
        },
      },
    });

    return projects;
  }

  async getProjectById(userId: number, projectId: number) {
    const project = await this.findProjectById(projectId);

    if (!project) throw new BadRequestException('The project does not exists');

    if (!this.isProjectMember(userId, project))
      throw new ForbiddenException('User is not a member');

    return project;
  }

  async createColumn(userId: number, column: CreateColumnDto) {
    const project = await this.findProjectById(column.projectId);

    if (!project) throw new BadRequestException('The project does not exists');

    if (!this.isProjectMember(userId, project))
      throw new ForbiddenException('User is not a member');

    const createdColumn = await this.columnService.createColumn(column);

    return createdColumn;
  }

  async updateColumn(userId: number, column: EditColumnDto) {
    const project = await this.findProjectById(column.projectId);

    if (!project) throw new BadRequestException('Project does not exist');

    const doesColumnExist = project.columns.some(({ id }) => column.id === id);

    if (!doesColumnExist)
      throw new BadRequestException('Column does not exist');

    if (!this.isProjectMember(userId, project))
      throw new BadRequestException('User is not a member');

    return this.columnService.editColumn(column);
  }

  async changeColumnOrder(column: ChangeColumnOrderDto) {
    return await this.columnService.changeColumnOrder(column);
  }

  async deleteColumn(userId: number, column: DeleteColumnDto) {
    const project = await this.findProjectById(column.projectId);

    if (!project) throw new BadRequestException('Project does not exist');

    const doesColumnExist = project.columns.some(({ id }) => column.id === id);

    if (!doesColumnExist)
      throw new BadRequestException('Column does not exist');

    if (!this.isProjectMember(userId, project))
      throw new BadRequestException('User is not a member');

    return this.columnService.deleteColumn(column);
  }

  private isProjectMember(
    userId: number,
    project: { masterId: number; collaborators: { id: number }[] },
  ) {
    return (
      project.collaborators.find(({ id }) => id === userId) ||
      project.masterId === userId
    );
  }

  private findProjectById(id: number) {
    return this.prisma.project.findFirst({
      where: {
        id,
      },
      include: {
        collaborators: {
          select: { id: true, email: true },
        },
        columns: {
          include: {
            tasks: true,
          },
        },
      },
    });
  }

  private findProjectWithCollaboratorsById(id: number) {
    return this.prisma.project.findFirst({
      where: {
        id,
      },
      include: {
        collaborators: true,
      },
    });
  }

  private addCollaboratorToProjectById(
    collaboratorId: number,
    projectId: number,
  ) {
    return this.prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        collaborators: {
          connect: {
            id: collaboratorId,
          },
        },
      },
      include: {
        collaborators: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });
  }
}
