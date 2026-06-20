import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const uri = config.get<string>('MONGO_URL');

        if (!uri) {
          throw new Error('MONGO_URL is not defined in .env');
        }

        return {
          uri,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
