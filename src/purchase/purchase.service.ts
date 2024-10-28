import { Injectable } from '@nestjs/common';
import { PurchaseRepository } from 'src/purchase/repositories/purchase.repository';
import {
  CreatePurchaseDto,
  CreatePurchaseResponseDto,
} from 'src/purchase/dto/create-purchase.dto';

@Injectable()
export class PurchaseService {
  constructor(private readonly purchaseRepository: PurchaseRepository) {}

  async create(
    userId: number,
    dto: CreatePurchaseDto,
  ): Promise<CreatePurchaseResponseDto> {
    return await this.purchaseRepository.createPurchase(userId, dto);
  }
}
