import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { UserEntity } from 'src/user/entities/user.entity';

export class CreatePurchaseDto {
  @IsString()
  @IsNotEmpty()
  market_hash_name: string = '';

  @IsBoolean()
  @IsNotEmpty()
  tradable: boolean = false;
}

export interface CreatePurchaseResponseDto
  extends Pick<UserEntity, 'balance'> {}
