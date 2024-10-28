import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserRepository } from 'src/user/repositories/user.repository';
import { UserAlreadyExistException } from 'src/user/exceptions/user-already-exist.exception';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserNotFoundException } from 'src/user/exceptions/user-not-found.exception';
import { UpdateUserPasswordDto } from 'src/user/dto/update-user-password.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(dto: CreateUserDto): Promise<UserEntity> {
    const existingUser = await this.userRepository.findByPhone(dto.phone);
    if (existingUser) {
      throw new UserAlreadyExistException();
    }

    return await this.userRepository.create(dto);
  }

  async findById(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new UserNotFoundException();
    }

    return user;
  }

  async findByPhone(phone: string): Promise<UserEntity> {
    const user = await this.userRepository.findByPhone(phone);
    if (!user) {
      throw new UserNotFoundException();
    }

    return user;
  }

  async updatePassword(dto: UpdateUserPasswordDto): Promise<UserEntity> {
    return await this.userRepository.updatePassword(dto);
  }
}
