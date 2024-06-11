import { ChangeColumnOrderDto } from './dto/change-order-column.dto';
import { DeleteColumnDto } from './dto/delete-column.dto';
import { ColumnService } from './column.service';
import { CreateColumnDto } from './dto/create-column.dto';
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
import { EditColumnDto } from './dto/edit-column.dto';

@Controller('columns')
export class ColumnController {
  constructor(private readonly columnService: ColumnService) {}

  @Post('')
  @HttpCode(201)
  @Auth()
  createColumn(
    @CurrentUser('id') currentUserId: number,
    @Body() column: CreateColumnDto,
  ) {
    return this.columnService.createColumn(currentUserId, column);
  }

  @Patch('')
  @HttpCode(200)
  @Auth()
  editColumn(
    @CurrentUser('id') currentUserId: number,
    @Body() column: EditColumnDto,
  ) {
    return this.columnService.editColumn(currentUserId, column);
  }

  @Delete('')
  @HttpCode(200)
  @Auth()
  deleteColumn(
    @CurrentUser('id') currentUserId: number,
    @Body() column: DeleteColumnDto,
  ) {
    return this.columnService.deleteColumn(currentUserId, column);
  }

  @Patch('order')
  @HttpCode(200)
  @Auth()
  changeColumnOrder(@Body() column: ChangeColumnOrderDto) {
    return this.columnService.changeColumnOrder(column);
  }
}
