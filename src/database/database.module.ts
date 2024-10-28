import { Module, Global } from '@nestjs/common';
import { postgresProvider } from 'src/database/database.provider';

@Global()
@Module({
  providers: [postgresProvider],
  exports: [postgresProvider],
})
export class DatabaseModule {}
