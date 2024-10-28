import { Inject } from '@nestjs/common';
import { POSTGRES_CLIENT } from 'src/database/database.provider';
import { Sql } from 'postgres';
import { User, UserEntity } from 'src/user/entities/user.entity';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UpdateUserPasswordDto } from 'src/user/dto/update-user-password.dto';

export class UserRepository {
  constructor(@Inject(POSTGRES_CLIENT) private readonly sql: Sql) {}

  async findById(id: number): Promise<UserEntity | null> {
    const [user] = await this.sql<User[]>`select * from users where id = ${id}`;
    return user ? new UserEntity(user) : null;
  }

  async findByPhone(phone: string): Promise<UserEntity | null> {
    const [user] = await this.sql<
      User[]
    >`select * from users where phone = ${phone}`;
    return user ? new UserEntity(user) : null;
  }

  async create(dto: CreateUserDto): Promise<UserEntity> {
    const [user] = await this.sql<
      User[]
    >`insert into users (phone, password) values (${dto.phone}, ${dto.password}) returning *`;
    return new UserEntity(user);
  }

  async updatePassword(dto: UpdateUserPasswordDto): Promise<UserEntity> {
    const [user] = await this.sql<
      User[]
    >`update users set password = ${dto.password} where id = ${dto.id} returning *`;
    return new UserEntity(user);
  }
}
