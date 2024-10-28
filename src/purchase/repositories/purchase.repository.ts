import { Inject } from '@nestjs/common';
import { POSTGRES_CLIENT } from 'src/database/database.provider';
import { Sql } from 'postgres';
import {
  CreatePurchaseDto,
  CreatePurchaseResponseDto,
} from 'src/purchase/dto/create-purchase.dto';
import { Item, ItemEntity } from 'src/item/entities/item.entity';
import { User, UserEntity } from 'src/user/entities/user.entity';
import { UserNotFoundException } from 'src/user/exceptions/user-not-found.exception';
import { ItemNotFoundException } from 'src/item/exceptions/item-not-found.exception';
import { ItemOutOfStockException } from 'src/item/exceptions/item-out-of-stock.exception';
import { InsufficientBalanceException } from 'src/user/exceptions/insufficient-balance.exception';

export class PurchaseRepository {
  constructor(@Inject(POSTGRES_CLIENT) private readonly sql: Sql) {}

  async createPurchase(
    userId: number,
    dto: CreatePurchaseDto,
  ): Promise<CreatePurchaseResponseDto> {
    return this.sql.begin(async (sql) => {
      const [item] = await sql<
        Item[]
      >`select * from items where market_hash_name = ${dto.market_hash_name} and tradable = ${dto.tradable}`;
      if (!item) {
        throw new ItemNotFoundException();
      }
      if (!item.min_price || item.quantity === 0) {
        throw new ItemOutOfStockException();
      }

      const itemEntity: ItemEntity = new ItemEntity(item);

      const [user] = await sql<
        User[]
      >`select * from users where id = ${userId} for update`;
      if (!user) {
        throw new UserNotFoundException();
      }

      const userEntity: UserEntity = new UserEntity(user);

      if (itemEntity.min_price && userEntity.balance < itemEntity.min_price) {
        throw new InsufficientBalanceException();
      }

      await sql`
        insert into purchases (user_id, market_hash_name, tradable, price)
        values (${userId}, ${dto.market_hash_name}, ${dto.tradable}, ${item.min_price})
      `;

      const [updatedUser] = await sql<User[]>`
        update users
        set balance = balance - ${item.min_price}, updated_at = ${Date.now()}
        where id = ${userId}
        returning balance
      `;

      return {
        balance: parseFloat(updatedUser.balance),
      };
    });
  }
}
