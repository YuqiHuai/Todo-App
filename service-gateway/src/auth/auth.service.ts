import { Injectable } from '@nestjs/common';
import {
  Transport,
  ClientProxy,
  ClientProxyFactory,
} from '@nestjs/microservices';
import { CreateUserDto } from './dto/CreateUserDto';
import { LoginDto } from './dto/LoginDto';
import { Tedis } from 'tedis';

@Injectable()
export class AuthService {
  private client: ClientProxy;
  private tedis: Tedis;

  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: 'service-auth',
        port: 3000,
      },
    });
    this.tedis = new Tedis({
      host: 'data-redis',
      port: 6379,
    });
  }
  async getHealth(): Promise<any> {
    return this.client.send<any, any>({ cmd: 'health' }, {});
  }

  async register(createUserDto: CreateUserDto): Promise<any> {
    return await this.client
      .send<any, CreateUserDto>({ cmd: 'register' }, createUserDto)
      .toPromise();
  }
  async login(loginDto: LoginDto): Promise<any> {
    return await this.client
      .send<any, LoginDto>({ cmd: 'login' }, loginDto)
      .toPromise();
  }

  async profile(accessToken: string): Promise<any> {
    return await this.client
      .send<any, string>({ cmd: 'profile' }, accessToken)
      .toPromise();
  }

  async profileOf(accessToken: string, id: string): Promise<any> {
    return await this.client
      .send({ cmd: 'profileOf' }, { accessToken, id })
      .toPromise();
  }

  async update(
    accessToken: string,
    createUserDto: CreateUserDto,
  ): Promise<any> {
    return await this.client
      .send({ cmd: 'update' }, { accessToken, createUserDto })
      .toPromise();
  }

  async updateFor(
    accessToken: string,
    createUserDto: CreateUserDto,
    id: string,
  ): Promise<any> {
    return await this.client
      .send({ cmd: 'updateFor' }, { accessToken, createUserDto, id })
      .toPromise();
  }

  async logout(accessToken: string) {
    await this.tedis.set(accessToken, 'BLACKLIST');
    await this.tedis.expire(accessToken, 24 * 60 * 60);
    return;
  }
}
