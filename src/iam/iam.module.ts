import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfig } from 'src/config/jwt.config';
import { AuthenticationService } from 'src/iam/authentication/authentication.service';
import { HashingService } from 'src/iam/hashing/hasing.service';
import { BcryptService } from 'src/iam/hashing/bcrypt.service';
import { AuthenticationGuard } from 'src/iam/authentication/guards/authentication.guard';
import { APP_GUARD } from '@nestjs/core';
import { RefreshTokenIdsStorage } from 'src/iam/authentication/storages/refresh-token-ids.storage';
import { AccessTokenGuard } from 'src/iam/authentication/guards/access-token.guard';
import { AuthenticationController } from 'src/iam/authentication/authentication.controller';

@Module({
  imports: [UserModule, JwtModule.registerAsync(JwtConfig.asProvider())],
  controllers: [AuthenticationController],
  providers: [
    { provide: HashingService, useClass: BcryptService },
    { provide: APP_GUARD, useClass: AuthenticationGuard },
    AuthenticationService,
    RefreshTokenIdsStorage,
    AccessTokenGuard,
  ],
  exports: [AuthenticationService],
})
export class IamModule {}
