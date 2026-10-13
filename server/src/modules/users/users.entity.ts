import { Roles } from './users.types';

export interface UserEntity {
  id: string;
  email: string;
  passwordHash: string;
  registeredAt: string;
  lastOnline: string;
  isBlocked: boolean;
  isDeleted: boolean;
  roles: Roles[];
  avatarUrl: string;
  birthdate: string;
  nickname: string;
  experience: number;
  coins: number;
  specialCoins: number;
}
