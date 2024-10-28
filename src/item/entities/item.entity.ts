export interface Item {
  market_hash_name: string;
  currency: string;
  suggested_price: string | null;
  item_page: string;
  market_page: string;
  min_price: string | null;
  max_price: string | null;
  mean_price: string | null;
  median_price: string | null;
  quantity: number;
  tradable: boolean;
  created_at: number;
  updated_at: number;
}

export class ItemEntity {
  market_hash_name: string;
  currency: string;
  suggested_price: number | null;
  item_page: string;
  market_page: string;
  min_price: number | null;
  max_price: number | null;
  mean_price: number | null;
  median_price: number | null;
  quantity: number;
  tradable: boolean;
  created_at: number;
  updated_at: number;

  constructor(item: Item) {
    this.market_hash_name = item.market_hash_name;
    this.currency = item.currency;
    this.suggested_price = item.suggested_price
      ? parseFloat(item.suggested_price)
      : null;
    this.item_page = item.item_page;
    this.market_page = item.market_page;
    this.min_price = item.min_price ? parseFloat(item.min_price) : null;
    this.max_price = item.max_price ? parseFloat(item.max_price) : null;
    this.mean_price = item.mean_price ? parseFloat(item.mean_price) : null;
    this.median_price = item.median_price
      ? parseFloat(item.median_price)
      : null;
    this.quantity = item.quantity;
    this.tradable = item.tradable;
    this.created_at = item.created_at;
    this.updated_at = item.updated_at;
  }
}
