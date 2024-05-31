import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post
} from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { AddCollaboratorDto } from './dto/add-collaborator.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectService } from './project.service';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post('/create')
  @HttpCode(201)
  @Auth()
  async create(
    @CurrentUser('id') currentUserId,
    @Body() createProjectDto: CreateProjectDto,
  ) {
    return await this.projectService.create(currentUserId, createProjectDto);
  }

  @Patch('/update-name')
  @HttpCode(200)
  @Auth()
  async updateName(
    @CurrentUser('id') currentUserId,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return await this.projectService.updateProjectName(
      currentUserId,
      updateProjectDto,
    );
  }

  @Patch('/add-collaborator')
  @HttpCode(200)
  @Auth()
  async addCollaborator(
    @CurrentUser('id') currentUserId,
    @Body() addCollaboratorDto: AddCollaboratorDto,
  ) {
    return await this.projectService.addCollaborator(
      currentUserId,
      addCollaboratorDto,
    );
  }

  @Get('/own')
  @HttpCode(200)
  @Auth()
  getOwnProjects(@CurrentUser('id') currentUserId) {
    return this.projectService.getOwnProjectsByUserId(currentUserId);
  }

  @Get('/collaborator')
  @HttpCode(200)
  @Auth()
  getCollaboratingProjects(@CurrentUser('id') currentUserId) {
    return this.projectService.getCollaboratingProjectsByUserId(currentUserId);
  }

  @Get('/:id')
  @HttpCode(200)
  @Auth()
  async getProjectById(
    @CurrentUser('id') currentUserId,
    @Param('id') projectId,
  ) {
    return await this.projectService.getProjectById(
      currentUserId,
      Number(projectId),
    );
  }
}
