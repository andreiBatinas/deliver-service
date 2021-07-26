import { Mapper } from '../../../core/infrastructure';
import { Restaurant } from '../domain/Restaurant';

export class RestaurantMap extends Mapper<Restaurant> {
  public static toBackend(restaurant: any): any {
    return {
      restaurantId: restaurant.restaurantId,
      restaurantName: restaurant.restaurantName,
      restaurantAddress: restaurant.restaurantAddress,
      restaurantUsername: restaurant.restaurantUsername,
      restaurantPassword: restaurant.restaurantPassword,
      restaurantTelephone: restaurant.restaurantTelephone,
      restaurantCreatedAt: restaurant.restaurantCreatedAt,
      restaurantUpdatedAt: restaurant.restaurantUpdatedAt,
      fleetId: restaurant.fleetId,
    };
  }

  public static toPersistent(restaurant: any): any {
    return {
      restaurantId: restaurant.restaurantId,
      restaurantName: restaurant.restaurantName,
      restaurantAddress: restaurant.restaurantAddress,
      restaurantUsername: restaurant.restaurantUsername,
      restaurantPassword: restaurant.restaurantPassword,
      restaurantTelephone: restaurant.restaurantTelephone,
      restaurantCreatedAt: restaurant.restaurantCreatedAt,
      restaurantUpdatedAt: restaurant.restaurantUpdatedAt,
      fleetId: restaurant.fleetId,
    };
  }

  // static toDomain(raw: any): Conversation {
  //   const conversationOrError = Conversation.New({
  //     campaignId: raw.account_id,
  //     name: raw.name,
  //     conversationId: raw.conversation_id,
  //   });

  //   return conversationOrError.getValue() as Conversation;
  // }

  static toDomainFromDb(raw: any): Restaurant {
    const restaurantOrError = Restaurant.New({
      fleetId: raw.fleetId,
      restaurantName: raw.restaurantName,
      restaurantAddress: raw.restaurantAddress,
      restaurantUsername: raw.restaurantUsername,
      restaurantPassword: raw.restaurantPassword,
      restaurantTelephone: raw.restaurantTelephone,
      restaurantCreatedAt: raw.restaurantCreatedAt,
      restaurantUpdatedAt: raw.restaurantUpdatedAt,
    });

    return restaurantOrError.getValue() as Restaurant;
  }

  static toFrontend(raw: Restaurant): any {
    return {
      fleetId: raw.fleetId,
      restaurantName: raw.restaurantName,
      restaurantAddress: raw.restaurantAddress,
      restaurantUsername: raw.restaurantUsername,
      restaurantPassword: raw.restaurantPassword,
      restaurantTelephone: raw.restaurantTelephone,
      restaurantCreatedAt: raw.restaurantCreatedAt,
      restaurantUpdatedAt: raw.restaurantUpdatedAt,
    };
  }
}
