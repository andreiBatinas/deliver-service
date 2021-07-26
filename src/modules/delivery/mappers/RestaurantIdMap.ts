import { Mapper } from '../../../core/infrastructure';
import { Restaurant } from '../domain/Restaurant';

export class RestaurantIdMap extends Mapper<Restaurant> {
  public static toBackend(restaurant: any): any {
    return {
      restaurantId: restaurant.restaurantId,
    };
  }

  public static toPersistent(restaurant: any): any {
    return {
      restaurantId: restaurant.restaurantId,
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

  // static toDomainFromDb(raw: any): Conversation {
  //   const conversationOrError = Conversation.New({
  //     campaignId: raw.campaignId,
  //     name: raw.name,
  //     conversationId: raw.conversationId,
  //   });

  //   return conversationOrError.getValue() as Conversation;
  // }

  static toFrontend(raw: any): any {
    return {
      restaurantId: raw.restaurantId,
    };
  }
}
