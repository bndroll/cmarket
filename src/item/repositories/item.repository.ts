import { Inject } from '@nestjs/common';
import { POSTGRES_CLIENT } from 'src/database/database.provider';
import { Sql } from 'postgres';
import { Item } from 'src/item/entities/item.entity';
import {
  FindItemRepositoryResponseDto,
  FindItemResponseDto,
  FindItemsWithPaginationRepositoryDto,
} from 'src/item/dto/find-items-with-pagination.dto';

export class ItemRepository {
  constructor(@Inject(POSTGRES_CLIENT) private readonly sql: Sql) {}

  async findAll(
    dto: FindItemsWithPaginationRepositoryDto,
  ): Promise<FindItemResponseDto[]> {
    const items = await this.sql<FindItemRepositoryResponseDto[]>`
      select
        t.market_hash_name,
        t.min_price as min_price_tradable,
        nt.min_price as min_price_not_tradable
      from items as t
      left join items as nt on nt.market_hash_name = t.market_hash_name and t.tradable = true and nt.tradable = false
      where t.tradable = true
      limit ${dto.limit} offset ${dto.offset};
    `;
    return items.map((item) => new FindItemResponseDto(item));
  }

  async insertMany(items: Array<Item>): Promise<void> {
    await this.sql.begin(async (sql) => {
      await sql`insert into items ${sql(items)}`;
    });
  }
}
