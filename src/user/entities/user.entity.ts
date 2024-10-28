export interface User {
  id: number;
  phone: string;
  password: string;
  balance: string;
  created_at: number;
  updated_at: number;
}

export class UserEntity {
  id: number;
  phone: string;
  password: string;
  balance: number;
  created_at: number;
  updated_at: number;

  constructor(user: User) {
    this.id = user.id;
    this.phone = user.phone;
    this.password = user.password;
    this.balance = parseFloat(user.balance);
    this.created_at = user.created_at;
    this.updated_at = user.updated_at;
  }
}
