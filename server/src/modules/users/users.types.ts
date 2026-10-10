export enum Roles {
  ADMIN = 'admin',
  USER = 'user',
}

export type TUserInfoFromDB = {
  id: string;
  email: string;
  nickname: string;
  passwordHash: string;
  roles: Roles[];
} | null;

export type TUserInfoInDB = Omit<TUserInfoFromDB, 'roles'> & {
  roles: string;
};