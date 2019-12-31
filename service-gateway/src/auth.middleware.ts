import { Injectable, NestMiddleware, Logger, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

interface User {
  id: string;
  name: string;
  email: string;
  validated: string;
  role: string;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    const accessToken = req.header('access_token') || '';
    try {
      const usr: User = jwt.verify(accessToken, process.env.TOKEN_SECRET) as User;
      req.body.uid = usr.id;
      next();
    } catch (e) {
      throw new UnauthorizedException('Access Token Required', 'Access Denied');
    }
  }
}
