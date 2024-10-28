import { Body, Controller, Post } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import {
  CreatePurchaseDto,
  CreatePurchaseResponseDto,
} from 'src/purchase/dto/create-purchase.dto';

@Controller('purchase')
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @Post()
  async create(
    @ActiveUser() user: ActiveUserData,
    @Body() dto: CreatePurchaseDto,
  ): Promise<CreatePurchaseResponseDto> {
    return await this.purchaseService.create(user.id, dto);
  }
}
