import { BadRequestException } from '@nestjs/common';

export class NewPasswordIsEqualException extends BadRequestException {
  constructor() {
    super('New password is equal to previous');
  }
}
