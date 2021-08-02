export interface AddOrderDTO {
  order: {
    orderNumber: string;
    orderContent: string;
    orderDeliveryAddress: string;
    orderPickUpTime: string;
    orderDeliveryTime: string;
    orderTelephoneClient: string;
    orderCreatedAt: Date;
    orderUpdatedAt: Date;
    restaurantId: number;
  };
}