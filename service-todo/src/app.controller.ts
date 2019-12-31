import { Controller, Get, Post, Body, Delete, Param, BadRequestException, Put } from '@nestjs/common';
import { AppService } from './app.service';
import { UserDto } from './dto/UserDto.dto';
import { CreateListDto } from './dto/CreateList.dto';
import { CreateItemDto } from './dto/CreateItem.dto';
import * as Joi from '@hapi/joi';
import { MessagePattern, RpcException } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // 5e0583a71b94010029faa7bb - Yuqi Huai - yhuai@uci.edu - ADMIN
  // 5e05e6667c6b6c0029f75a78 - Yu Lu - ylu31@uci.edu - USER

  _validateUserDto(userDto: UserDto) {
    const validator = Joi.object({
      uid: Joi.string().required(),
    });
    const { error } = validator.validate(userDto);
    if (error) {
      // throw new BadRequestException(error.details[0].message);
      throw new RpcException({status: 400, message: error.details[0].message});
    }
  }

  _validateCreateListDto(createListDto: CreateListDto) {
    const validator = Joi.object({
      uid: Joi.string().required(),
      name: Joi.string().required(),
    });
    const { error } = validator.validate(createListDto);
    if (error) {
      // throw new BadRequestException(error.details[0].message);
      throw new RpcException({status: 400, message: error.details[0].message});
    }
  }

  _validateCreateItemDto(createItemDto: CreateItemDto) {
    const validator = Joi.object({
      uid: Joi.string().required(),
      name: Joi.string(),
      completed: Joi.boolean(),
    });
    const {error} = validator.validate(createItemDto);
    if (error) {
      // throw new BadRequestException(error.details[0].message);
      throw new RpcException({status: 400, message: error.details[0].message});
    }
  }

  // @Get('/health')
  @MessagePattern({ cmd: 'health' })
  async getHealth() {
    return {status: 'RUNNING'};
  }

  // @Post('/list')
  // createList(@Body() createListDto: CreateListDto) {
  @MessagePattern({ cmd: 'createList' })
  async createList(createListDto: CreateListDto) {
    this._validateCreateListDto(createListDto);
    return await this.appService.createList(createListDto);
  }

  // @Get('/list')
  // async getLists(@Body() userDto: UserDto) {
  @MessagePattern({ cmd: 'getLists' })
  async getLists(userDto: UserDto) {
    this._validateUserDto(userDto);
    return await this.appService.getLists(userDto);
  }

  // @Post('/list/:id')
  // async addToList(@Body() createItemDto: CreateItemDto, @Param('id') id: string) {
  @MessagePattern({ cmd: 'addToList' })
  async addToList({createItemDto, id}) {
    this._validateCreateListDto(createItemDto);
    try {
      return await this.appService.addToList(createItemDto, id);
    } catch (e) {
      // throw new BadRequestException('Invalid uid / lid');
      throw new RpcException({status: 400, message: 'Invalid uid / lid'});
    }
  }

  // @Get('/list/:id')
  // async getListItems(@Body() userDto: UserDto, @Param('id') id: string) {
  @MessagePattern({ cmd: 'getListItems' })
  async getListItems({userDto, id}) {
    this._validateUserDto(userDto);
    try {
      return await this.appService.getListItems(userDto, id);
    } catch (e) {
      // throw new BadRequestException('Invalid uid / lid');
      throw new RpcException({status: 400, message: 'Invalid uid / lid'});
    }
  }

  // @Put('/list/:id')
  // async updateList(@Body() createListDto: CreateListDto, @Param('id') id: string) {
  @MessagePattern({ cmd: 'updateList' })
  async updateList({createListDto, id}) {
    this._validateCreateListDto(createListDto);
    try {
      return await this.appService.updateList(createListDto, id);
    } catch (e) {
      // throw new BadRequestException('Invalid uid / lid');
      throw new RpcException({status: 400, message: 'Invalid uid / lid'});
    }
  }

  // @Put('/list/:id/:iid')
  // async updateListItem(@Body() itemDto: CreateItemDto, @Param('id') id: string, @Param('iid') iid: string) {
  @MessagePattern({ cmd: 'updateListItem' })
  async updateListItem({itemDto, id, iid}) {
    this._validateCreateItemDto(itemDto);
    try {
      return await this.appService.updateListItem(itemDto, id, iid);
    } catch (e) {
      // throw new BadRequestException('Invalid uid / lid');
      throw new RpcException({status: 400, message: 'Invalid uid / lid'});
    }
  }

  // @Delete('/list/:id')
  // async deleteList(@Body() userDto: UserDto, @Param('id') id: string) {
  @MessagePattern({ cmd: 'deleteList' })
  async deleteList({userDto, id}) {
    this._validateUserDto(userDto);
    try {
      return await this.appService.deleteList(userDto, id);
    } catch (e) {
      // throw new BadRequestException('Invalid uid / lid');
      throw new RpcException({status: 400, message: 'Invalid uid / lid'});
    }
  }

  // @Delete('/list/:id/:iid')
  // async deleteListItem(@Body() userDto: UserDto, @Param('id') id: string, @Param('iid') iid: string) {
  @MessagePattern({ cmd: 'deleteListItem' })
  async deleteListItem({userDto, id, iid}) {
    this._validateUserDto(userDto);
    try {
      return await this.appService.deleteListItem(userDto, id, iid);
    } catch (e) {
      // throw new BadRequestException('Invalid uid / lid');
      throw new RpcException({status: 400, message: 'Invalid uid / lid'});
    }
  }

}
