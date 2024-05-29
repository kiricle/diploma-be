import { DeleteTaskDto } from './../task/dto/delete-task.dto';
import { UpdateTaskDto } from './../task/dto/update-task.dto';
import { DeleteColumnDto } from './../column/dto/delete-column.dto';
import { CreateTaskDto } from './../task/dto/create-task.dto';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Delete,
} from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { AddCollaboratorDto } from './dto/add-collaborator.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectService } from './project.service';
import { CreateColumnDto } from 'src/column/dto/create-column.dto';
import { EditColumnDto } from 'src/column/dto/edit-column.dto';

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

  @Post('/column')
  @HttpCode(201)
  @Auth()
  createColumn(
    @CurrentUser('id') currentUserId,
    @Body() column: CreateColumnDto,
  ) {
    return this.projectService.createColumn(currentUserId, column);
  }

  @Patch('/column')
  @HttpCode(200)
  @Auth()
  updateColumn(
    @CurrentUser('id') currentUserId,
    @Body() column: EditColumnDto,
  ) {
    return this.projectService.updateColumn(currentUserId, column);
  }

  @Delete('/column')
  @HttpCode(200)
  @Auth()
  deleteColumn(
    @CurrentUser('id') currentUserId,
    @Body() column: DeleteColumnDto,
  ) {
    return this.projectService.deleteColumn(currentUserId, column);
  }

  @Post('/task')
  @HttpCode(201)
  @Auth()
  createTask(@CurrentUser('id') currentUserId, @Body() task: CreateTaskDto) {
    return this.projectService.createTask(currentUserId, task);
  }

  @Patch('/task')
  @HttpCode(200)
  @Auth()
  updateTask(@CurrentUser('id') currentUserId, @Body() task: UpdateTaskDto) {
    return this.projectService.updateTask(currentUserId, task);
  }

  @Delete('/task')
  @HttpCode(200)
  @Auth()
  deleteTask(@CurrentUser('id') currentUserId, @Body() task: DeleteTaskDto) {
    return this.projectService.deleteTask(currentUserId, task);
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
