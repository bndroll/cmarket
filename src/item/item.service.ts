import { Injectable } from '@nestjs/common';
import { ItemRepository } from 'src/item/repositories/item.repository';
import {
  FindItemResponseDto,
  FindItemsWithPaginationDto,
} from 'src/item/dto/find-items-with-pagination.dto';
import { ItemStorage } from 'src/item/storages/item.storage';

@Injectable()
export class ItemService {
  constructor(
    private readonly itemRepository: ItemRepository,
    private readonly itemStorage: ItemStorage,
  ) {}

  async findAll(
    dto: FindItemsWithPaginationDto,
  ): Promise<FindItemResponseDto[]> {
    const limit = dto.size ? dto.size : 100;
    const offset = dto.page ? (dto.page - 1) * limit : 0;

    const cachedItems = await this.itemStorage.get({
      limit: limit,
      offset: offset,
    });
    if (cachedItems.length > 0) {
      return cachedItems;
    }

    const items = await this.itemRepository.findAll({
      limit: limit,
      offset: offset,
    });
    await this.itemStorage.insert(
      {
        limit: limit,
        offset: offset,
      },
      items,
    );

    return items;
  }
}
