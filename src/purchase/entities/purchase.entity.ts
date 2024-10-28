export interface Purchase {
  id: number;
  user_id: number;
  market_hash_name: string;
  tradable: boolean;
  price: string;
  created_at: number;
  updated_at: number;
}

export class PurchaseEntity {
  id: number;
  user_id: number;
  market_hash_name: string;
  tradable: boolean;
  price: number;
  created_at: number;
  updated_at: number;

  constructor(purchase: Purchase) {
    this.id = purchase.id;
    this.user_id = purchase.user_id;
    this.market_hash_name = purchase.market_hash_name;
    this.tradable = purchase.tradable;
    this.price = parseFloat(purchase.price);
    this.created_at = purchase.created_at;
    this.updated_at = purchase.updated_at;
  }
}
