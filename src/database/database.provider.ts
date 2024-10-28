import { ConfigService } from '@nestjs/config';
import { Provider } from '@nestjs/common';
import * as postgres from 'postgres';

export const POSTGRES_CLIENT = 'POSTGRES_CLIENT';

export const postgresProvider: Provider = {
  provide: POSTGRES_CLIENT,
  inject: [ConfigService],
  useFactory: async (configService: ConfigService): Promise<postgres.Sql> => {
    return postgres({ ...configService.getOrThrow('postgres') });
  },
};
