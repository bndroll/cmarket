import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from 'src/user/repositories/user.repository';
import { IamModule } from 'src/iam/iam.module';

@Module({
  imports: [forwardRef(() => IamModule)],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
