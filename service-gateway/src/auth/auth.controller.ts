import {
  Controller,
  Get,
  Post,
  Body,
  Logger,
  HttpException,
  HttpCode,
  Headers,
  Param,
  Put,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/CreateUserDto';
import { LoginDto } from './dto/LoginDto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/health')
  async getHealth(): Promise<any> {
    return await this.authService.getHealth();
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.authService.register(createUserDto);
    } catch (e) {
      Logger.log(e);
      // throw new BadRequestException(e.message);
      throw new HttpException(e, e.status);
    }
  }

  @Post('/login')
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto) {
    try {
      return await this.authService.login(loginDto);
    } catch (e) {
      Logger.log(e);
      throw new HttpException(e, e.status);
    }
  }

  @Get('/profile')
  async profile(@Headers('access_token') accessToken: string) {
    try {
      return await this.authService.profile(accessToken);
    } catch (e) {
      Logger.log(e);
      throw new HttpException(e, e.status);
    }
  }

  @Get('/profile/:id')
  async getProfileOf(
    @Headers('access_token') accessToken: string,
    @Param('id') id: string,
  ) {
    try {
      return await this.authService.profileOf(accessToken, id);
    } catch (e) {
      Logger.log(e);
      throw new HttpException(e, e.status);
    }
  }

  @Put('/update')
  async update(
    @Headers('access_token') accessToken: string,
    @Body() createUserDto: CreateUserDto,
  ) {
    try {
      return await this.authService.update(accessToken, createUserDto);
    } catch (e) {
      Logger.log(e);
      throw new HttpException(e, e.status);
    }
  }

  @Put('/update/:id')
  async updateFor(
    @Headers('access_token') accessToken: string,
    @Body() userDto: CreateUserDto,
    @Param('id') id: string,
  ) {
    try {
      return await this.authService.updateFor(accessToken, userDto, id);
    } catch (e) {
      Logger.log(e);
      throw new HttpException(e, e.status);
    }
  }

  @Get('/logout')
  async logout(
    @Headers('access_token') accessToken: string,
  ) {
    await this.authService.logout(accessToken);
    return {message: 'OK'};
  }
}
