import {
  Column,
  Entity,
  PrimaryColumn,
} from 'typeorm';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryColumn({
    name: 'id',
  })
  orderId?: number;

  @Column({
    name: 'number',
    nullable: false,
  })
  orderNumber?: string;

  @Column({
    name: 'content',
    nullable: false,
  })
  orderContent?: string;

  @Column({
    name: 'deliveryAddress',
    nullable: false,
  })
  orderDeliveryAddress?: string;

  @Column({
    name: 'pickUpTime',
    nullable: false,
  })
  orderPickUpTime?: string;

  @Column({
    name: 'deliveryTime',
    nullable: false,
  })
  orderDeliveryTime?: string;

  @Column({
    name: 'telephoneClient',
    nullable: false,
  })
  orderTelephoneClient?: string;

  @Column({
    name: 'createdAt',
    type: Date,
    nullable: false,
  })
  orderCreatedAt?: string;

  @Column({
    name: 'updatedAt',
    type: Date,
    nullable: false,
  })
  orderUpdatedAt?: string;

  @Column({
    name: 'restaurantId',
    nullable: false,
  })
  restaurantId?: number;

  // @OneToMany(() => Module, (module) => module.conversation)
  // modules?: Module[];
}
