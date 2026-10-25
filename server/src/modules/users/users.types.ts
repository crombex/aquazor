export enum Roles {
  ADMIN = 'admin',
  USER = 'user',
}

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

export type TUserEntityMapped = Omit<
  UserEntity,
  'roles' | 'isDeleted' | 'isBlocked' | 'lastOnline' | 'passwordHash'
> & {
  roles: Roles[];
};

export type TUserInDatabase = {
  id: string;
  email: string;
  password_hash: string;
  registered_at: string;
  last_online: string;
  is_blocked: boolean;
  is_deleted: boolean;
  roles: string;
  avatar_url: string;
  birthdate: string;
  nickname: string;
  experience: number;
  coins: number;
  special_coins: number;
};

export type TUserFindOptions = {
  /**
   * Never set 'true' if this user object leaves the server because of sensitive data
   */
  includeSensitiveData?: boolean;
};
