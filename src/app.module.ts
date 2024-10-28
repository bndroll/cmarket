import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtConfig } from 'src/config/jwt.config';
import { RedisConfig } from 'src/config/redis.config';
import { RedisModule } from '@nestjs-modules/ioredis';
import { DatabaseModule } from 'src/database/database.module';
import { PostgresConfig } from 'src/config/postgres.config';
import { IamModule } from './iam/iam.module';
import { UserModule } from './user/user.module';
import { ItemModule } from './item/item.module';
import { PurchaseModule } from 'src/purchase/purchase.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env`,
      isGlobal: true,
      load: [PostgresConfig, RedisConfig, JwtConfig],
    }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ...configService.getOrThrow('redis'),
      }),
      inject: [ConfigService],
    }),
    DatabaseModule,
    HttpModule,
    IamModule,
    UserModule,
    ItemModule,
    PurchaseModule,
  ],
})
export class AppModule {}
