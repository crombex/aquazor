import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DB_POOL } from '../database/database.types';
import { Pool, PoolClient } from 'pg';
import {
  TFishingActionData,
  TFishingActionRow,
  TFishingActionSlotRow,
  TFishingActionSlotsData,
  TFishingActionsUserRows,
} from './game.types';

@Injectable()
export class GameRepository {
  constructor(@Inject(DB_POOL) private readonly pool: Pool) {}

  async getPendingActions(connection: PoolClient) {
    const result = await connection.query<TFishingActionRow>(
      `SELECT * FROM fishing_actions WHERE status = 'pending' AND finished_at <= NOW() LIMIT 20`,
    );
    const rows = result.rows;
    return rows;
  }

  async updateAction(actionId: string, connection: PoolClient) {
    const result = await connection.query(
      `UPDATE fishing_actions SET status = 'completed' WHERE id = $1 AND status = 'pending' AND finished_at <= NOW()`,
      [actionId],
    );
    if (result.rowCount === 0) {
      throw new InternalServerErrorException('Internal server error');
    }
  }

  async getActionSlots(actionId: string, connection: PoolClient) {
    const result = await connection.query<TFishingActionSlotRow>(
      `SELECT * FROM fishing_action_slots WHERE fishing_action_id = $1 ORDER BY slot_number ASC`,
      [actionId],
    );
    return result.rows;
  }

  async updateActionSlot(
    slotId: string,
    inventoryFishId: string,
    connection: PoolClient,
  ) {
    await connection.query(
      `UPDATE fishing_action_slots SET inventory_fish_id = $1 WHERE id = $2`,
      [inventoryFishId, slotId],
    );
  }

  async createFishingAction({
    payload: {
      id,
      finishedAt,
      inventoryFishermanId,
      locationId,
      startedAt,
      status,
      userId,
    },
    connection,
  }: TFishingActionData) {
    await connection.query(
      `INSERT INTO fishing_actions (
        id,
        finished_at,
        inventory_fisherman_id,
        location_id,
        started_at,
        status,
        user_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        id,
        finishedAt,
        inventoryFishermanId,
        locationId,
        startedAt,
        status,
        userId,
      ],
    );
  }

  async createFishingActionSlots({
    payload,
    connection,
  }: TFishingActionSlotsData) {
    const sqlQuery = `
    INSERT INTO fishing_action_slots
    (
      id,
      fishing_action_id,
      slot_number,
      inventory_rod_id,
      inventory_bait_id,
      fish_id,
      was_caught,
      fish_weight,
      fish_length,
      fish_sell_price,
      experience_earned,
      bait_consumed
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    `;
    for (let i = 0; i < payload.length; i++) {
      const currentSlot = payload[i];
      await connection.query(sqlQuery, [
        currentSlot.id,
        currentSlot.fishingActionId,
        currentSlot.slotNumber,
        currentSlot.inventoryRodId,
        currentSlot.inventoryBaitId,
        currentSlot.fishId,
        currentSlot.wasCaught,
        currentSlot.fishWeight,
        currentSlot.fishLength,
        currentSlot.fishSellPrice,
        currentSlot.experienceEarned,
        currentSlot.baitConsumed,
      ]);
    }
  }

  async getUserFullFishingActions({
    userId,
    offset,
    limit,
  }: {
    userId: string;
    limit: number;
    offset: number;
  }) {
    const result: TFishingActionsUserRows[] = [];
    const fishingActions = (
      await this.pool.query<TFishingActionRow>(
        `
      SELECT *
      FROM fishing_actions
      WHERE user_id = $1
      ORDER BY finished_at DESC
      LIMIT $2
      OFFSET $3
      `,
        [userId, limit, offset],
      )
    ).rows;
    for (const action of fishingActions) {
      const actionSlots = (
        await this.pool.query<TFishingActionSlotRow>(
          `SELECT * FROM fishing_action_slots WHERE fishing_action_id = $1 ORDER BY slot_number ASC`,
          [action.id],
        )
      ).rows;
      result.push({
        head: action,
        slots: actionSlots,
      });
    }
    return result;
  }
}
