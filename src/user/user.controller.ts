import { Body, Controller, Patch } from '@nestjs/common';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { AuthenticationService } from 'src/iam/authentication/authentication.service';
import { UpdatePasswordRequestDto } from 'src/iam/authentication/dto/update-password.dto';
import { RefreshTokenResponseDto } from 'src/iam/authentication/dto/refresh-token.dto';

@Controller('user')
export class UserController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Patch('password')
  async updatePassword(
    @ActiveUser() user: ActiveUserData,
    @Body() dto: UpdatePasswordRequestDto,
  ): Promise<RefreshTokenResponseDto> {
    return await this.authenticationService.updatePassword({
      id: user.id,
      oldPassword: dto.oldPassword,
      newPassword: dto.newPassword,
    });
  }
}
