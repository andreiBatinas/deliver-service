import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Module } from './oldModels/Module';

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
  accountTelephone?: number;

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
