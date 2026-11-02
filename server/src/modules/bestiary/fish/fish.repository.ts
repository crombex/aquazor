import { Pool } from 'pg';
import { DB_POOL } from '../../database/database.types';
import { Inject } from '@nestjs/common';
import { FishEntity, TFishInDatabase } from './fish.types';
import { EGameRarity } from '../../game/game.types';
import { randomPickInRange } from '../../../common/utils/range-random-pick';

export class FishRepository {
  constructor(@Inject(DB_POOL) private pool: Pool) {}

  async findOneById(id: string) {
    const query = await this.pool.query<TFishInDatabase>(
      `SELECT 
        id,
        type,
        max_weight,
        min_weight,
        max_length,
        min_length,
        min_probability,
        max_probability,
        image_url,
        description,
        rarity,
        min_sell_price,
        unavailable 
      FROM fish WHERE id = $1`,
      [id],
    );
    if (query.rows.length > 0) {
      return query.rows[0];
    } else {
      return null;
    }
  }

  async getOneInCategory(category: EGameRarity) {
    const fishInCategoryCount = (
      await this.pool.query<{ quantity: number }>(
        `
      SELECT 
        COUNT(id) AS quantity
      FROM fish
      WHERE rarity = $1
      `,
        [category],
      )
    ).rows[0].quantity;

    const index = randomPickInRange(0, fishInCategoryCount - 1, true);
    const fish = (
      await this.pool.query<FishEntity>(
        `
      SELECT 
        id,
        type,
        max_weight,
        min_weight,
        max_length,
        min_length,
        min_probability,
        max_probability,
        image_url,
        description,
        rarity,
        min_sell_price,
        unavailable
      FROM fish
      WHERE rarity = $1
      ORDER BY id
      LIMIT 1
      OFFSET $2
      `,
        [category, index],
      )
    ).rows[0];
    return fish;
  }
}
