export interface AddRestaurantDTO {
  restaurant: {
    restaurantName: string;
    restaurantAddress: string;
    restaurantUsername: string;
    restaurantPassword: string;
    restaurantTelephone: string;
    restaurantCreatedAt: Date;
    restaurantUpdatedAt: Date;
    fleetId: number;
  };
}
