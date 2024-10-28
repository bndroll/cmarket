import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @IsNotEmpty()
  @IsString()
  refreshToken: string = '';
}

export interface RefreshTokenResponseDto {
  accessToken: string;
  refreshToken: string;
}
