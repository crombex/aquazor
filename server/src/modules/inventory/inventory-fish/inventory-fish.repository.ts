import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { DB_POOL } from '../../database/database.types';
import { TAddInventoryFish, TInventoryFishFromDatabase } from '../inventory-fish/inventory-fish.types';
import { TAddInventoryItem } from '../common/inventory.types';
import { FishEntity } from '../../bestiary/fish/fish.types';

@Injectable()
export class InventoryFishRepository {
  constructor(@Inject(DB_POOL) private pool: Pool) {}

  async getAllUserFish(userId: string): Promise<TInventoryFishFromDatabase[]> {
    let sqlQuery = `
      SELECT 
        infi.id,
        infi.user_id,
        infi.fish_id,
        infi.weight,
        infi.length,
        infi.description,
        infi.sell_price,
        fish.image_url,
        fish.type,
        fish.rarity,
        fish.unavailable
      FROM inventory_fish AS infi
      LEFT JOIN fish ON fish.id = infi.fish_id
      WHERE infi.user_id = $1
      ORDER BY fish.type ASC
    `;
    const result = await this.pool.query<TInventoryFishFromDatabase>(sqlQuery, [
      userId,
    ]);
    return result.rows;
  }

  // async addFish({ item, userId, connection }: TAddInventoryItem<TAddInventoryFish>) {
  //   if (connection) {
  //     await connection.query(
  //       `INSERT INTO inventory_fish (id, user_id, fish_id, )`,
  //     );
  //   }
  // }
}
