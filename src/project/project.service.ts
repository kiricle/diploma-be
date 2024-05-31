import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from './../user/user.service';
import { AddCollaboratorDto } from './dto/add-collaborator.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
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

  isProjectMember(
    userId: number,
    project: { masterId: number; collaborators: { id: number }[] },
  ) {
    return (
      project.collaborators.find(({ id }) => id === userId) ||
      project.masterId === userId
    );
  }

  findProjectById(id: number) {
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
