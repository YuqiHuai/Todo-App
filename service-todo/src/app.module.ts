import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TodoListSchema } from './schemas/TodoList.schema';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://data-todo:27017/todo'),
    MongooseModule.forFeature([{name: 'List', schema: TodoListSchema}])
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
