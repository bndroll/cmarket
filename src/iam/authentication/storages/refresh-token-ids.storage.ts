import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { StoragePrefixType } from 'src/lang/types/storage-prefix.type';

export class InvalidatedRefreshTokenError extends Error {}

@Injectable()
export class RefreshTokenIdsStorage {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async insert(userId: number, tokenId: string): Promise<void> {
    await this.redis.set(this.getKey(userId), tokenId, 'EX', 60 * 60 * 24);
  }

  async validate(userId: number, tokenId: string): Promise<boolean> {
    const storageId = await this.redis.get(this.getKey(userId));
    if (storageId !== tokenId) {
      throw new InvalidatedRefreshTokenError();
    }
    return storageId === tokenId;
  }

  async invalidate(userId: number): Promise<void> {
    await this.redis.del(this.getKey(userId));
  }

  private getKey(userId: number): string {
    return `${StoragePrefixType.RefreshToken}-${userId}`;
  }
}
