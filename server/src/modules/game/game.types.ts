import { PoolClient } from 'pg';
import { StartFishingDTO } from './dto/start-fishing.dto';

export type TGameRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
export type TFishingActionStatus = 'pending' | 'completed';

export interface IStartFishingBody {
  userId: string;
  rods: StartFishingDTO['rods'];
  baits: StartFishingDTO['baits'];
  fisherman: StartFishingDTO['fisherman'];
  location: StartFishingDTO['location'];
}

export interface IFishingAction {
  id: string;
  userId: string;
  locationId: string;
  inventoryFishermanId: string;
  startedAt: string;
  finishedAt: string;
  status: TFishingActionStatus;
}

export interface IFishingActionSlot {
  id: string;
  fishingActionId: string;
  slotNumber: number;
  inventoryRodId: string;
  inventoryBaitId: string | null;
  fishId: string | null;
  wasCaught: boolean;
  fishWeight: number | null;
  fishLength: number | null;
  fishSellPrice: number | null;
  experienceEarned: number;
  baitConsumed: boolean;
}

export type TFishingActionRow = Pick<IFishingAction, 'id' | 'status'> & {
  user_id: string;
  location_id: string;
  inventory_fisherman_id: string;
  started_at: string;
  finished_at: string;
};

export type TFishingActionSlotRow = Pick<IFishingActionSlot, 'id'> & {
  fishing_action_id: string;
  slot_number: number;
  inventory_rod_id: string;
  inventory_bait_id: string | null;
  fish_id: string | null;
  was_caught: boolean;
  fish_weight: number | null;
  fish_length: number | null;
  fish_sell_price: number | null;
  experience_earned: number;
  bait_consumed: boolean;
  inventory_fish_id: string | null;
};

export type TFishingActionData = {
  payload: IFishingAction;
  connection: PoolClient;
};

export type TFishingActionSlotsData = {
  payload: IFishingActionSlot[];
  connection: PoolClient;
};

export type TFishingActionsUserRows = {
  head: TFishingActionRow;
  slots: TFishingActionSlotRow[];
};

export type TFishingActionsUser = {
  head: IFishingAction;
  slots: IFishingActionSlot[];
};
