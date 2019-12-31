import { Controller, Get, Post, Body, BadRequestException, HttpCode, Headers, Param, Put, Head, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateUserDto } from './dto/CreateUserDto';
import Joi = require('@hapi/joi');
import { User } from './interfaces/user.interface';
import { LoginDto } from './dto/LoginDto';
import * as bcryptjs from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { MessagePattern, RpcException, Payload } from '@nestjs/microservices';

interface VUser {
  id: string;
  name: string;
  email: string;
  validated: boolean;
  role: string;
  access_token?: string;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  createUserValidation = () => Joi.object({
    name: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(16).required(),
  })

  updateUserValidation = () => Joi.object({
    name: Joi.string().min(2),
    email: Joi.string().email(),
    password: Joi.string().min(6).max(16),
    validated: Joi.boolean(),
  })

  loginValidation = () => Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(16).required(),
  })

  _serialize(user: User): VUser {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      validated: user.validated,
      role: user.role,
    };
  }

  // @Get()
  @MessagePattern({ cmd: 'health' })
  getHealth() {
    return this.appService.getHealth();
  }

  // @Post('/register')
  // async createUser(@Body() createUserDto: CreateUserDto): Promise<VUser> {
  @MessagePattern({ cmd: 'register' })
  async createUser(createUserDto: CreateUserDto): Promise<VUser> {
    const { error } = this.createUserValidation().validate(createUserDto);
    if (error) {
      // throw new BadRequestException(error.details[0].message, 'Invalid Request');
      throw new RpcException({status: 400, message: error.details[0].message});
    }

    const userByEmail = await this.appService.findUserByEmail(createUserDto.email);
    if (userByEmail) {
      // throw new BadRequestException('Email already exists!', 'Invalid Request');
      throw new RpcException({status: 400, message: 'Email already exists!'});
    }

    try {
      const newUser = await this.appService.createUser(createUserDto);
      return this._serialize(newUser);
    } catch (e) {
      throw new RpcException({status: 500, message: 'Internal Server Error'});
    }
  }

  // @Post('/login')
  // @HttpCode(200)
  // async login(@Body() loginDto: LoginDto): Promise<any> {
  @MessagePattern({ cmd: 'login'})
  async login(loginDto: LoginDto): Promise<any> {
    const { error } = this.loginValidation().validate(loginDto);
    if (error) {
      // throw new BadRequestException(error.details[0].message, 'Invalid Request');
      throw new RpcException({status: 400, message: error.details[0].message});
    }
    const userByEmail = await this.appService.findUserByEmail(loginDto.email);
    if (!userByEmail) {
      // throw new BadRequestException('Email/password does not match!', 'Invalid Credential');
      throw new RpcException({status: 400, message: 'Email/password does not match!'});
    }

    const validated = await bcryptjs.compare(loginDto.password, userByEmail.password);
    if (!validated) {
      // throw new BadRequestException('Email/password does not match!', 'Invalid Credential');
      throw new RpcException({status: 400, message: 'Email/password does not match!'});
    }

    try {
      const serializedUser = this._serialize(userByEmail);
      const jwtToken = jwt.sign(serializedUser, process.env.TOKEN_SECRET, {expiresIn: '1h'});
      serializedUser.access_token = jwtToken;
      return {access_token: jwtToken};
    } catch (e) {
      throw new RpcException({status: 500, message: 'Internal Server Error'});
    }
  }

  _verifyToken(token: string, role: string = '') {
    try {
      if (!token) {
        throw new BadRequestException();
      }
      const user: VUser = jwt.verify(token, process.env.TOKEN_SECRET) as VUser;
      if (role !== '' && user.role !== role) {
        throw new BadRequestException();
      }
    } catch (e) {
      // throw new BadRequestException('Invalid access token!', 'Invalid Credential');
      throw new RpcException({status: 400, message: 'Invalid access token!'});
    }
  }

  // @Get('/profile')
  // async getProfile(@Headers('access_token') accessToken: string) {
  @MessagePattern({ cmd: 'profile' })
  async getProfile(accessToken: string) {
    this._verifyToken(accessToken);
    const user: VUser = jwt.decode(accessToken) as VUser;
    const dbUser = await this.appService.findUserById(user.id);
    return this._serialize(dbUser);
  }

  // @Get('/profile/:id')
  // async getProfileOf(@Headers('access_token') accessToken: string, @Param('id') id: string) {
  @MessagePattern({ cmd: 'profileOf'})
  async getProfileOf({accessToken, id}) {
    this._verifyToken(accessToken, 'ADMIN');
    try {
      const dbUser = await this.appService.findUserById(id);
      return this._serialize(dbUser);
    } catch (e) {
      // throw new BadRequestException('Invalid id!', 'Invalid Request');
      throw new RpcException({status: 400, message: 'Invalid id!'});
    }
  }

  // @Put('/update')
  // async update(@Headers('access_token') accessToken: string, @Body() createUserDto: CreateUserDto) {
  @MessagePattern({ cmd: 'update'})
  async update({accessToken, createUserDto}) {
    this._verifyToken(accessToken);
    const { error } = this.updateUserValidation().validate(createUserDto);
    if (error) {
      // throw new BadRequestException(error.details[0].message, 'Invalid Request');
      throw new RpcException({status: 400, message: error.details[0].message});
    }
    const user: VUser = jwt.decode(accessToken) as VUser;
    if (user.role === 'USER' && createUserDto && createUserDto.validated) {
      throw new RpcException({status: 401, message: 'Unauthorized action!'});
    }
    try {
      const updatedUser = await this.appService.updateUser(user.id, createUserDto);
      return this._serialize(updatedUser);
    } catch (e) {
      // throw new BadRequestException('Invalid id!', 'Invalid Request');
      throw new RpcException({status: 400, message: 'Invalid id!'});
    }
  }

  // @Put('/update/:id')
  // async updateFor(@Headers('access_token') accessToken: string, @Body() userDto: CreateUserDto, @Param('id') id: string) {
  @MessagePattern({ cmd: 'updateFor' })
  async updateFor({accessToken, createUserDto, id}) {
    this._verifyToken(accessToken, 'ADMIN');
    const { error } = this.updateUserValidation().validate(createUserDto);
    if (error) {
      // throw new BadRequestException(error.details[0].message, 'Invalid Request');
      throw new RpcException({status: 400, message: error.details[0].message});
    }
    try {
      const updatedUser = await this.appService.updateUser(id, createUserDto);
      return this._serialize(updatedUser);
    } catch (e) {
      // throw new BadRequestException('Invalid id!', 'Invalid Request');
      Logger.log(e);
      throw new RpcException({status: 400, message: 'Invalid id!'});
    }
  }

}
