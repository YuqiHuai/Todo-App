import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './interfaces/user.interface';
import { CreateUserDto } from './dto/CreateUserDto';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class AppService {

  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  getHealth() {
    return { message: 'RUNNING', token_secret: process.env.TOKEN_SECRET };
  }

  async findUserByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({email});
  }
  async findUserById(id: string): Promise<User> {
    return await this.userModel.findById(id);
  }
  async createUser(createUserDto: CreateUserDto) {
    const salt = await bcryptjs.genSalt(10);
    const hash = await bcryptjs.hash(createUserDto.password, salt);
    createUserDto.password = hash;
    const newUser = new this.userModel(createUserDto);
    newUser.validated = false;
    newUser.role = 'USER';
    return await newUser.save();
  }

  async updateUser(id: string, userDto: CreateUserDto) {
    const usr = await this.findUserById(id);

    if (!userDto) {
      return await usr.save();
    }

    if (userDto.name) {
      usr.name = userDto.name;
    }

    if (userDto.email) {
      usr.email = userDto.email;
    }

    if (userDto.password) {
      const salt = await bcryptjs.genSalt(10);
      const hash = await bcryptjs.hash(userDto.password, salt);
      usr.password = hash;
    }

    if (userDto.validated) {
      usr.validated = userDto.validated;
    }

    return await usr.save();
  }

}
