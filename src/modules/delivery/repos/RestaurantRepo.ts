import { DeleteResult } from 'typeorm';

import { DB } from '../../../infrastructure/typeorm';
import { Restaurant } from '../domain/Restaurant';
import { RestaurantMap } from '../mappers/RestaurantMap';

export interface IRestaurantRepo {
  //findAccountByAccountName(name: string): Promise<Account | null>;
  findRestaurantByRestaurantId(
    restaurantId: number,
  ): Promise<Restaurant | null>;
  save(restaurant: Restaurant): Promise<Restaurant>;
  exists(restaurantName: string): Promise<boolean>;
  //findRestaurantsByFleetId(fleetId: number): Promise<Restaurant[]>;
  findRestaurantsByAccountId(accountId: number): Promise<Restaurant[]>;
  removeRestaurantByRestaurantId(restaurantId: number): Promise<boolean>;
  updateRestaurant(restaurant: Restaurant): Promise<Restaurant | null>;
}

export class RestaurantRepo implements IRestaurantRepo {
  private models: any;

  constructor(models: any) {
    this.models = models;
  }

  public async exists(restaurantName: string): Promise<boolean> {
    const restaurantModel = this.models.Restaurant;
    const r = await DB.getRepository(restaurantModel).findOne({
      restaurantName,
    });
    if (r !== undefined) return true;
    return false;
  }

  // public async findAccountByAccountName(name: string): Promise<Account | null> {
  //   const accountModel = this.models.Account;
  //   const account = await DB.getRepository(accountModel).findOne({
  //     where: {
  //       name,
  //     },
  //   });

  //   if (undefined === account) {
  //     return null;
  //   }
  //   return account as Account;
  // }

  public async save(restaurant: Restaurant): Promise<Restaurant> {
    const restaurantaModel = this.models.Restaurant;
    const rawRestaurant = RestaurantMap.toPersistent(restaurant);

    const restaurantRepo = DB.getRepository(restaurantaModel);
    const c = new restaurantaModel();

    c.restaurantName = rawRestaurant.restaurantName;
    c.restaurantAddress = rawRestaurant.restaurantAddress;
    c.restaurantCreatedAt = new Date();
    c.restaurantUpdatedAt = rawRestaurant.restaurantUpdatedAt;
    c.restaurantPassword = rawRestaurant.restaurantPassword;
    c.restaurantUsername = rawRestaurant.restaurantUsername;
    c.restaurantTelephone = rawRestaurant.restaurantTelephone;
    c.fleetId = rawRestaurant.fleetId;
    c.accountId = rawRestaurant.accountId;

    const restaurantResult = await restaurantRepo.save(c);

    const restaurantAdded: any = await restaurantRepo.findOne({
      restaurantName: c.restaurantName,
      restaurantAddress: c.restaurantAddress,
      accountId: c.accountId,
      restaurantCreatedAt: c.restaurantCreatedAt,
    });
    restaurantResult.userId = restaurantAdded.userId;

    return restaurantResult;
  }

  public async findRestaurantsByAccountId(
    accountId: number,
  ): Promise<Restaurant[]> {
    const restaurantModel = this.models.Restaurant;
    const r = await DB.getRepository(restaurantModel).find({
      where: {
        accountId,
      },
    });

    const restaurantList = r.map((entry: any) => {
      return RestaurantMap.toDomainFromDb(entry);
    });

    return restaurantList;
  }

  public async findRestaurantByRestaurantId(
    restaurantId: number,
  ): Promise<Restaurant | null> {
    const restaurantModel = this.models.Restaurant;
    const restaurant = await DB.getRepository(restaurantModel).findOne({
      where: {
        restaurantId,
      },
      //relations: ['modules'],
    });

    if (undefined === restaurant) {
      return null;
    }
    return restaurant as Restaurant;
  }

  // public async findModulesByConversationId(
  //   conversationId: string,
  // ): Promise<Account[]> {
  //   const conversationModel = this.models.Conversation;
  //   const conversation = await DB.getRepository(conversationModel).findOne({
  //     where: {
  //       conversationId,
  //     },
  //     relations: ['modules'],
  //   });

  //   return [];
  // }
  public async removeRestaurantByRestaurantId(
    restaurantId: number,
  ): Promise<boolean> {
    const restaurantModel = this.models.Restaurant;
    const result: DeleteResult = await DB.getRepository(restaurantModel).delete(
      {
        restaurantId,
      },
    );

    if (result.affected === 0) {
      return false;
    }
    return true;
  }

  public async updateRestaurant(
    restaurant: Restaurant,
  ): Promise<Restaurant | null> {
    const restaurantModel = this.models.Restaurant;
    const rawRestaurant = RestaurantMap.toPersistent(restaurant);
    const criteria = { restaurantId: restaurant.restaurantId };
    const propertiesToUpdate: any = { restaurantUpdatedAt: new Date() };
    if (rawRestaurant.restaurantName) {
      propertiesToUpdate.restaurantName = rawRestaurant.restaurantName;
    }
    if (rawRestaurant.restaurantAddress) {
      propertiesToUpdate.restaurantAddress = rawRestaurant.restaurantAddress;
    }
    if (rawRestaurant.restaurantUsername) {
      propertiesToUpdate.restaurantUsername = rawRestaurant.restaurantUsername;
    }
    if (rawRestaurant.restaurantPassword) {
      propertiesToUpdate.restaurantPassword = rawRestaurant.restaurantPassword;
    }
    if (rawRestaurant.restaurantTelephone) {
      propertiesToUpdate.restaurantTelephone =
        rawRestaurant.restaurantTelephone;
    }

    const result = await DB.getRepository(restaurantModel).update(
      criteria,
      propertiesToUpdate,
    );
    if (undefined === result) {
      return null;
    }
    return rawRestaurant;
  }
}
