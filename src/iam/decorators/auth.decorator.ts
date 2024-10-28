import { AuthType } from '../enums/auth-type.enum';
import { CustomDecorator, SetMetadata } from '@nestjs/common';

export const AUTH_TYPE_KEY = 'authType';

export const Auth = (...authTypes: AuthType[]): CustomDecorator =>
  SetMetadata(AUTH_TYPE_KEY, authTypes);
