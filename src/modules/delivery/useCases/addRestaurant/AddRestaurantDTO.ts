export interface AddRestaurantDTO {
  restaurantToAdd: {
    restaurantName: string;
    restaurantAddress: string;
    restaurantUsername: string;
    restaurantPassword: string;
    restaurantTelephone: string;
    fleetName: string;
    accountId: number;
  };
}
