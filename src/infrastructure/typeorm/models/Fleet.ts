import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'fleets' })
export class Fleet {
  @PrimaryColumn({
    name: 'id',
  })
  fleetId?: number;

  @Column({
    name: 'name',
    nullable: false,
  })
  fleetName?: string;

  @Column({
    name: 'accountId',
    nullable: false,
  })
  accountId?: number;

  @Column({
    name: 'location',
    nullable: false,
  })
  fleetLocation?: string;

  @Column({
    name: 'createdAt',
    type: Date,

    nullable: false,
  })
  fleetCreatedAt?: string;

  @Column({
    name: 'updatedAt',
    type: Date,
    nullable: false,
  })
  fleetUpdatedAt?: string;

  // @OneToMany(() => Module, (module) => module.conversation)
  // modules?: Module[];
}
