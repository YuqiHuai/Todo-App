import { Injectable, NestMiddleware, Logger, UnauthorizedException } from '@nestjs/common';
import { AppService } from './app.service';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class BlacklistMiddleware implements NestMiddleware {

  private logger: Logger;

  constructor(private readonly appService: AppService) {
    this.logger = new Logger('BLACKLIST');
  }

  async use(req: any, res: any, next: () => void) {
    const accessToken = req.header('access_token') || '';

    if (accessToken !== '') {
      // Non empty accessToken
      try {
        jwt.verify(accessToken, process.env.TOKEN_SECRET);
      } catch (e) {
        throw new UnauthorizedException('Invalid Access Token', 'Access Denied');
      }
      const keyExists: boolean = await this.appService.exists(accessToken);
      this.logger.log(keyExists);
      if (keyExists) {
        throw new UnauthorizedException('Invalid Access Token', 'Access Denied');
      }
    }
    next();
  }
}
