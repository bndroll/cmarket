import { ConflictException } from '@nestjs/common';

export class InsufficientBalanceException extends ConflictException {
  constructor() {
    super('Insufficient balance');
  }
}
