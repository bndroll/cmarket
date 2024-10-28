import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ItemRepository } from 'src/item/repositories/item.repository';
import { ItemHttpDto } from 'src/item/http/dto/item.dto';
import { Item } from 'src/item/entities/item.entity';

@Injectable()
export class ItemsHttpService {
  private readonly batchSize = 500;

  constructor(
    private readonly httpService: HttpService,
    private readonly itemRepository: ItemRepository,
  ) {}

  private async loadItems(): Promise<void> {
    await Promise.all([
      await this.loadItemsByTradable(true),
      await this.loadItemsByTradable(false),
    ]);
  }

  private async loadItemsByTradable(tradable: boolean): Promise<void> {
    const items: ItemHttpDto[] = await this.httpService.axiosRef
      .get<
        ItemHttpDto[]
      >(`https://api.skinport.com/v1/items?app_id=730&currency=EUR&tradable=${tradable ? 1 : 0}`)
      .then((r) => r.data);

    let counter = 0;
    const batch: Array<Item | undefined> = new Array(this.batchSize);

    for (const item of items) {
      batch[counter++] = {
        ...item,
        tradable: tradable,
        suggested_price: item.suggested_price
          ? String(item.suggested_price)
          : null,
        min_price: item.min_price ? String(item.min_price) : null,
        max_price: item.max_price ? String(item.max_price) : null,
        mean_price: item.mean_price ? String(item.mean_price) : null,
        median_price: item.median_price ? String(item.median_price) : null,
      };

      if (counter === this.batchSize) {
        await this.itemRepository.insertMany(batch.filter((item) => !!item));
        batch.fill(undefined);
        counter = 0;
      }
    }

    if (counter > 0) {
      await this.itemRepository.insertMany(
        batch.slice(0, counter).filter((item) => !!item),
      );
    }
  }
}
