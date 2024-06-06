import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { AddCommentDto } from './dto/add-comment.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { DeleteTaskDto } from './dto/delete-task.dto';
import { GetCommentsDto } from './dto/get-comments.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskService } from './task.service';

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
  deleteTask(
    @CurrentUser('id') currentUserId: number,
    @Body() task: DeleteTaskDto,
  ) {
    return this.taskService.deleteTask(currentUserId, task);
  }

  @Post('/comment')
  @HttpCode(201)
  @Auth()
  addComment(
    @CurrentUser('id') currentUserId: number,
    @Body() addCommentDto: AddCommentDto,
  ) {
    return this.taskService.addComment(currentUserId, addCommentDto);
  }

  @Get('/comments')
  @HttpCode(200)
  @Auth()
  getComments(
    @CurrentUser('id') userId: number,
    @Query() getCommentsDto: GetCommentsDto,
  ) {
    console.log(getCommentsDto);
    return this.taskService.getComments(userId, getCommentsDto);
  }
}
