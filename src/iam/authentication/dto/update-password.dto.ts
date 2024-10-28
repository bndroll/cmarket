import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdatePasswordRequestDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  oldPassword: string = '';

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  newPassword: string = '';
}

export class UpdatePasswordDto extends UpdatePasswordRequestDto {
  id: number = 0;
}
