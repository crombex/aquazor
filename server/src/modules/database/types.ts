export const DB_POOL = 'DB_POOL';

export interface IMigration {
  id: string, // UUID
  filename: string,
  hash: string, // SHA256
  last_modified: string // 2026-05-03 14:34:50
}