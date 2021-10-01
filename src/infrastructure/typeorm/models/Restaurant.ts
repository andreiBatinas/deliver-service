import {
  Column,
  Entity,
  PrimaryColumn,
} from 'typeorm';

@Entity({ name: 'restaurants' })
export class Restaurant {
  @PrimaryColumn({
    name: 'id',
  })
  restaurantId?: number;

  @Column({
    name: 'name',
    nullable: false,
  })
  restaurantName?: string;

  @Column({
    name: 'address',
    nullable: false,
  })
  restaurantAddress?: string;

  @Column({
    name: 'username',
    nullable: false,
  })
  restaurantUsername?: string;

  @Column({
    name: 'password',
    nullable: false,
  })
  restaurantPassword?: string;

  @Column({
    name: 'telephone',
    nullable: false,
  })
  restaurantTelephone?: string;

  @Column({
    name: 'createdAt',
    type: Date,
    nullable: false,
  })
  restaurantCreatedAt?: string;

  @Column({
    name: 'updatedAt',
    type: Date,
    nullable: false,
  })
  restaurantUpdatedAt?: string;

  @Column({
    name: 'fleetId',
    nullable: false,
  })
  fleetId?: number;

  @Column({
    name: 'accountId',
    nullable: false,
  })
  accountId?: number;

  // @OneToMany(() => Module, (module) => module.conversation)
  // modules?: Module[];
}
