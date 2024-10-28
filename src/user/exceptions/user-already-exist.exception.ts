import { ConflictException } from '@nestjs/common';

export class UserAlreadyExistException extends ConflictException {
  constructor() {
    super('User with same phone number already exists');
  }
}
