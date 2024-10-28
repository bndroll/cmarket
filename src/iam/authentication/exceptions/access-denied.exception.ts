import { UnauthorizedException } from '@nestjs/common';

export class AccessDeniedException extends UnauthorizedException {
  constructor() {
    super('Access denied');
  }
}
