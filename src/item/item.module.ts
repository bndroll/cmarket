import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { ItemRepository } from 'src/item/repositories/item.repository';
import { ItemsHttpService } from 'src/item/http/items.http';
import { HttpModule } from '@nestjs/axios';
import { ItemStorage } from 'src/item/storages/item.storage';

@Module({
  imports: [HttpModule],
  controllers: [ItemController],
  providers: [ItemService, ItemRepository, ItemStorage, ItemsHttpService],
})
export class ItemModule {}
