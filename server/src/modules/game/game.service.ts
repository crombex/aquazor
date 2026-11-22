import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { InventoryRodsService } from '../inventory/inventory-rods/inventory-rods.service';
import { InventoryBaitsService } from '../inventory/inventory-baits/inventory-baits.service';
import { LocationsService } from '../bestiary/locations/locations.service';

@Injectable()
export class GameService {
  constructor(
    private readonly usersService: UsersService,
    private readonly inventoryRods: InventoryRodsService,
    private readonly inventoryBaits: InventoryBaitsService,
    private readonly locationsService: LocationsService
  ) {}
}
