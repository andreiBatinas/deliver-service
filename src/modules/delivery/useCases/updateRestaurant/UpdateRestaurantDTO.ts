export interface UpdateRestaurantDTO {
  restaurant: {
    restaurantId: number;
    restaurantName: string;
    restaurantAddress: string;
    restaurantPassword: string;
    restaurantUsername: string;
    restaurantTelephone: string;
    restaurantCreatedAt: Date;
    restaurantUpdatedAt: Date;
    fleetId: number;
  };
}