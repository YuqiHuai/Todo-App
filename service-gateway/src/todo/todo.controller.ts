import {
  Controller,
  Get,
  Post,
  Body,
  Logger,
  HttpException,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateListDto } from './dto/CreateList.dto';
import { CreateItemDto } from './dto/CreateItem.dto';
import { UserDto } from './dto/UserDto.dto';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}
  // @Get('/health')
  @Get('/health')
  async getHealth() {
    return await this.todoService.getHealth();
  }

  @Post('/list')
  async createList(@Body() createListDto: CreateListDto) {
    try {
      return await this.todoService.createList(createListDto);
    } catch (e) {
      Logger.log(e);
      throw new HttpException(e, e.status);
    }
  }

  @Get('/list')
  async getLists(@Body() userDto: UserDto) {
      try {
          return await this.todoService.getLists(userDto);
      } catch (e) {
          Logger.log(e);
          throw new HttpException(e, e.status);
      }
  }

  @Post('/list/:id')
  async addToList(
    @Body() createItemDto: CreateItemDto,
    @Param('id') id: string,
  ) {
    try {
        return await this.todoService.addToList(createItemDto, id);
    } catch (e) {
        Logger.log(e);
        throw new HttpException(e, e.status);
    }
  }

  @Get('/list/:id')
  async getListItems(@Body() userDto: UserDto, @Param('id') id: string) {
    try {
        return await this.todoService.getListItems(userDto, id);
    } catch (e) {
        Logger.log(e);
        throw new HttpException(e, e.status);
    }
  }

  @Put('/list/:id')
  async updateList(
    @Body() createListDto: CreateListDto,
    @Param('id') id: string,
  ) {
    try {
        return await this.todoService.updateList(createListDto, id);
    } catch (e) {
        Logger.log(e);
        throw new HttpException(e, e.status);
    }
  }

  @Put('/list/:id/:iid')
  async updateListItem(
    @Body() itemDto: CreateItemDto,
    @Param('id') id: string,
    @Param('iid') iid: string,
  ) {
    try {
        return this.todoService.updateListItem(itemDto, id, iid);
    } catch (e) {
        Logger.log(e);
        throw new HttpException(e, e.status);
    }
  }

  @Delete('/list/:id')
  async deleteList(@Body() userDto: UserDto, @Param('id') id: string) {
      try {
          return await this.todoService.deleteList(userDto, id);
      } catch (e) {
          Logger.log(e);
          throw new HttpException(e, e.status);
      }
  }

  @Delete('/list/:id/:iid')
  async deleteListItem(
    @Body() userDto: UserDto,
    @Param('id') id: string,
    @Param('iid') iid: string,
  ) {
    try {
        return await this.todoService.deleteListItem(userDto, id, iid);
    } catch (e) {
        Logger.log(e);
        throw new HttpException(e, e.status);
    }
  }
}
