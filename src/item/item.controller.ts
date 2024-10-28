import { Controller, Get, Query } from '@nestjs/common';
import { ItemService } from './item.service';
import {
  FindItemResponseDto,
  FindItemsWithPaginationDto,
} from 'src/item/dto/find-items-with-pagination.dto';

@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Get()
  async findAll(
    @Query() dto: FindItemsWithPaginationDto,
  ): Promise<FindItemResponseDto[]> {
    return await this.itemService.findAll(dto);
  }
}
