import { User } from 'src/user/entities/user.entity';

export interface ActiveUserData extends Pick<User, 'id'> {
  tokenId: string;
}
