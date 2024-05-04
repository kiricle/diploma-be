import { Body, Controller, HttpCode, Patch, Post } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { AddCollaboratorDto } from './dto/add-collaborator.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectService } from './project.service';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post('/create')
  @HttpCode(201)
  @Auth()
  async create(
    @CurrentUser('id') masterId,
    @Body() createProjectDto: CreateProjectDto,
  ) {
    return await this.projectService.create(masterId, createProjectDto);
  }

  @Patch('/update-name')
  @HttpCode(200)
  @Auth()
  async updateName(
    @CurrentUser('id') id,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return await this.projectService.updateProjectName(id, updateProjectDto);
  }

  @Patch('/add-collaborator')
  @HttpCode(200)
  @Auth()
  async addCollaborator(
    @CurrentUser('id') id,
    @Body() addCollaboratorDto: AddCollaboratorDto,
  ) {
    return await this.projectService.addCollaborator(id, addCollaboratorDto);
  }
}
