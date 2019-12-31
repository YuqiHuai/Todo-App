import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { TodoList } from './interfaces/TodoList.interface';
import { Item } from './interfaces/Item.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateListDto } from './dto/CreateList.dto';
import { UserDto } from './dto/UserDto.dto';
import { CreateItemDto } from './dto/CreateItem.dto';

@Injectable()
export class AppService {

  constructor(
    @InjectModel('List') private readonly todoListModel: Model<TodoList>,
    // private readonly itemModel: Model<Item>,
  ) {}

  async createList(createListDto: CreateListDto) {
    const createdList = await this.todoListModel.create(createListDto);
    createdList.createdAt = Date.now();
    return await createdList.save();
  }

  async getLists(userDto: UserDto) {
    const result = await this.todoListModel.find({uid: userDto.uid});
    return result;
  }

  async addToList(createItemDto: CreateItemDto, listId: string) {

    const list = await this.todoListModel.findOne({uid: createItemDto.uid, _id: listId});
    const newItem = {name: createItemDto.name} as Item;
    newItem.completed = false;
    newItem.createdAt = Date.now();
    list.items.push(newItem);
    return await list.save();
  }

  async getListItems(userDto: UserDto, listId: string) {
    const list = await this.todoListModel.findOne({uid: userDto.uid, _id: listId});
    return list.items;
  }

  async updateList(createListDto: CreateListDto, listId: string) {
    const list = await this.todoListModel.findOne({uid: createListDto.uid, _id: listId});
    list.name = createListDto.name;
    return await list.save();
  }

  async updateListItem(createItemDto: CreateItemDto, listId: string, itemId: string) {
    const list = await this.todoListModel.findOne({uid: createItemDto.uid, _id: listId});

    list.items = list.items.map((obj) => {
      if (obj._id.toString() === itemId) {
        if (createItemDto.name) {
          obj.name = createItemDto.name;
        }
        if (createItemDto.completed) {
          obj.completed = createItemDto.completed;
        }
      }
      return obj;
    });
    return await list.save();
  }

  async deleteList(userDto: UserDto, listId: string) {
    const list = await this.todoListModel.findOne({uid: userDto.uid, _id: listId});
    return await list.remove();
  }

  async deleteListItem(userDto: UserDto, listId: string, itemId: string) {
    const list = await this.todoListModel.findOne({uid: userDto.uid, _id: listId});
    list.items = list.items.filter(item => {
      return item._id.toString() !== itemId;
    });
    return await list.save();
  }

}
