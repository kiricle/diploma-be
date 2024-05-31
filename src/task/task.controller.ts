import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Patch,
  Post,
} from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskService } from './task.service';
import { DeleteTaskDto } from './dto/delete-task.dto';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post('')
  @HttpCode(201)
  @Auth()
  createTask(
    @CurrentUser('id') currentUserId: number,
    @Body() task: CreateTaskDto,
  ) {
    return this.taskService.createTask(currentUserId, task);
  }

  @Patch('')
  @HttpCode(200)
  @Auth()
  updateTask(
    @CurrentUser('id') currentUserId: number,
    @Body() task: UpdateTaskDto,
  ) {
    return this.taskService.updateTask(currentUserId, task);
  }

  @Delete('')
  @HttpCode(200)
  @Auth()
  deleteTask(@CurrentUser('id') currentUserId, @Body() task: DeleteTaskDto) {
    return this.taskService.deleteTask(currentUserId, task);
  }
}
