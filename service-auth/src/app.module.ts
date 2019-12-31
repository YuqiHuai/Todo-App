import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://data-auth:27017/user'),
    MongooseModule.forFeature([{name: 'User', schema: UserSchema}]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
