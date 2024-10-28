import { ConflictException } from '@nestjs/common';

export class ItemOutOfStockException extends ConflictException {
  constructor() {
    super('Item out of stock');
  }
}
