import { Injectable } from '@nestjs/common';
import {
  Transport,
  ClientProxy,
  ClientProxyFactory,
} from '@nestjs/microservices';
import { CreateItemDto } from './dto/CreateItem.dto';
import { CreateListDto } from './dto/CreateList.dto';
import { UserDto } from './dto/UserDto.dto';

@Injectable()
export class TodoService {
  private client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: 'service-todo',
        port: 3000,
      },
    });
  }

  async getHealth() {
    return this.client.send({ cmd: 'health' }, {});
  }
  async createList(createListDto: CreateListDto) {
    return await this.client
      .send({ cmd: 'createList' }, createListDto)
      .toPromise();
  }

  async getLists(userDto: UserDto) {
    return await this.client.send({ cmd: 'getLists' }, userDto).toPromise();
  }

  async addToList(createItemDto: CreateItemDto, id: string) {
    return await this.client
      .send({ cmd: 'addToList' }, { createItemDto, id })
      .toPromise();
  }

  async getListItems(userDto: UserDto, id: string) {
    return await this.client
      .send({ cmd: 'getListItems' }, { userDto, id })
      .toPromise();
  }

  async updateList(createListDto: CreateListDto, id: string) {
    return await this.client
      .send({ cmd: 'updateList' }, { createListDto, id })
      .toPromise();
  }

  async updateListItem(itemDto: CreateItemDto, id: string, iid: string) {
    return await this.client
      .send({ cmd: 'updateListItem' }, { itemDto, id, iid })
      .toPromise();
  }

  async deleteList(userDto: UserDto, id: string) {
    return await this.client
      .send({ cmd: 'deleteList' }, { userDto, id })
      .toPromise();
  }

  async deleteListItem(userDto: UserDto, id: string, iid: string) {
    return await this.client
      .send({ cmd: 'deleteListItem' }, { userDto, id, iid })
      .toPromise();
  }
}
