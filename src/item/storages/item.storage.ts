import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { StoragePrefixType } from 'src/lang/types/storage-prefix.type';
import {
  FindItemResponseDto,
  FindItemsWithPaginationRepositoryDto,
} from 'src/item/dto/find-items-with-pagination.dto';

@Injectable()
export class ItemStorage {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async insert(
    dto: FindItemsWithPaginationRepositoryDto,
    items: FindItemResponseDto[],
  ): Promise<void> {
    await this.redis.set(this.getKey(dto), JSON.stringify(items), 'EX', 60 * 5);
  }

  async get(
    dto: FindItemsWithPaginationRepositoryDto,
  ): Promise<FindItemResponseDto[]> {
    const data = await this.redis.get(this.getKey(dto));
    return data ? JSON.parse(data) : [];
  }

  private getKey(dto: FindItemsWithPaginationRepositoryDto): string {
    return `${StoragePrefixType.Items}-${dto.limit}-${dto.offset}`;
  }
}
