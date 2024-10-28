import { UnauthorizedException } from '@nestjs/common';

export class WrongPasswordException extends UnauthorizedException {
  constructor() {
    super('Password doest not match');
  }
}
