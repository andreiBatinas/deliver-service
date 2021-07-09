import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'accounts' })
export class Account {
  @PrimaryColumn({
    name: 'id',
  })
  accountId?: number;

  @Column({
    name: 'name',
    nullable: false,
  })
  accountName?: string;

  @Column({
    name: 'password',
    nullable: false,
  })
  accountPassword?: string;

  @Column({
    name: 'email',
    nullable: false,
  })
  accountEmail?: string;

  @Column({
    name: 'cui',
    nullable: false,
  })
  accountCUI?: string;

  @Column({
    name: 'officeAddress',
    nullable: false,
  })
  accountOfficeAddress?: string;

  @Column({
    name: 'telephone',
    nullable: false,
  })
  accountTelephone?: string;

  @Column({
    name: 'createdAt',
    type: Date,

    nullable: false,
  })
  accountCreatedAt?: string;

  @Column({
    name: 'updatedAt',
    type: Date,
    nullable: false,
  })
  accountUpdatedAt?: string;

  // @OneToMany(() => Module, (module) => module.conversation)
  // modules?: Module[];
}
