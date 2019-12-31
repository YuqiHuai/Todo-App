import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TodoModule } from './todo/todo.module';
import { AuthMiddleware } from './auth.middleware';
import { BlacklistMiddleware } from './blacklist.middleware';

@Module({
  imports: [AuthModule, TodoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('/todo');
    consumer.apply(BlacklistMiddleware).forRoutes('/');
  }
}
