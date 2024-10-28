import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import {
  InvalidatedRefreshTokenError,
  RefreshTokenIdsStorage,
} from './storages/refresh-token-ids.storage';
import { JwtConfig } from 'src/config/jwt.config';
import { HashingService } from 'src/iam/hashing/hasing.service';
import { UserService } from 'src/user/user.service';
import { SignUpDto } from 'src/iam/authentication/dto/sign-up.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { randomUUID } from 'crypto';
import {
  RefreshTokenDto,
  RefreshTokenResponseDto,
} from 'src/iam/authentication/dto/refresh-token.dto';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { SignInDto } from 'src/iam/authentication/dto/sign-in.dto';
import { AccessDeniedException } from 'src/iam/authentication/exceptions/access-denied.exception';
import { WrongPasswordException } from 'src/iam/authentication/exceptions/wrong-password.exception';
import { UpdatePasswordDto } from 'src/iam/authentication/dto/update-password.dto';
import { NewPasswordIsEqualException } from 'src/iam/authentication/exceptions/new-password-is-equal.exception';

@Injectable()
export class AuthenticationService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    @Inject(JwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof JwtConfig>,
    private readonly refreshTokenIdsStorage: RefreshTokenIdsStorage,
  ) {}

  async signUp(dto: SignUpDto): Promise<UserEntity> {
    const hashedPassword = await this.hashingService.hash(dto.password);

    return await this.userService.create({
      phone: dto.phone,
      password: hashedPassword,
    });
  }

  async signIn(dto: SignInDto): Promise<RefreshTokenResponseDto> {
    const user = await this.userService.findByPhone(dto.phone);

    const isEqual = await this.hashingService.compare(
      dto.password,
      user.password,
    );
    if (!isEqual) {
      throw new WrongPasswordException();
    }

    return await this.generateTokens(user.id);
  }

  async refreshToken(dto: RefreshTokenDto): Promise<RefreshTokenResponseDto> {
    try {
      const { id, tokenId } = await this.jwtService.verifyAsync<
        ActiveUserData & { tokenId: string }
      >(dto.refreshToken, {
        secret: this.jwtConfiguration.secret,
      });

      const user = await this.userService.findById(id);
      const isValid = await this.refreshTokenIdsStorage.validate(
        user.id,
        tokenId,
      );
      if (isValid) {
        await this.refreshTokenIdsStorage.invalidate(user.id);
      } else {
        throw new Error('Refresh token is invalid');
      }

      return await this.generateTokens(user.id);
    } catch (err) {
      if (err instanceof InvalidatedRefreshTokenError) {
        throw new AccessDeniedException();
      }

      throw new UnauthorizedException();
    }
  }

  async updatePassword(
    dto: UpdatePasswordDto,
  ): Promise<RefreshTokenResponseDto> {
    const user = await this.userService.findById(dto.id);

    const isEqual = await this.hashingService.compare(
      dto.oldPassword,
      user.password,
    );
    if (!isEqual) {
      throw new WrongPasswordException();
    }

    if (dto.oldPassword === dto.newPassword) {
      throw new NewPasswordIsEqualException();
    }

    const newPassword = await this.hashingService.hash(dto.newPassword);

    await this.userService.updatePassword({
      id: dto.id,
      password: newPassword,
    });

    await this.refreshTokenIdsStorage.invalidate(user.id);

    return await this.generateTokens(user.id);
  }

  async generateTokens(userId: number): Promise<RefreshTokenResponseDto> {
    const tokenId = randomUUID();
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken(userId, this.jwtConfiguration.accessTokenTtl, {
        tokenId: tokenId,
      }),
      this.signToken(userId, this.jwtConfiguration.refreshTokenTtl, {
        tokenId: tokenId,
      }),
    ]);

    await this.refreshTokenIdsStorage.insert(userId, tokenId);

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  private async signToken<T>(
    userId: number,
    expiresIn: number,
    payload?: T,
  ): Promise<string> {
    return await this.jwtService.signAsync(
      {
        id: userId,
        ...payload,
      },
      {
        secret: this.jwtConfiguration.secret,
        expiresIn: expiresIn,
      },
    );
  }
}
