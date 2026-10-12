export interface ICreateAuthSession {
  userId: string;
  userDevice: string;
  sessionExpiresAt: string;
}

export interface IAuthSessionInDatabase {
  id: string;
  user_id: string;
  started_at: string;
  expired_at: string;
  device: string
}