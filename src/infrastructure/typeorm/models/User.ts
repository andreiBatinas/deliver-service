import {
  Column,
  Entity,
  PrimaryColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryColumn({
    name: 'id',
  })
  userId?: number;

  @Column({
    name: 'name',
    nullable: false,
  })
  userName?: string;

  @Column({
    name: 'surname',
    nullable: false,
  })
  userSurname?: string;

  @Column({
    name: 'password',
    nullable: false,
  })
  userPassword?: string;

  @Column({
    name: 'email',
    nullable: false,
  })
  userEmail?: string;

  @Column({
    name: 'role',
    nullable: false,
  })
  userRole?: string;

  @Column({
    name: 'telephone',
    nullable: false,
  })
  userTelephone?: string;

  @Column({
    name: 'createdAt',
    type: Date,

    nullable: false,
  })
  userCreatedAt?: string;

  @Column({
    name: 'updatedAt',
    type: Date,
    nullable: false,
  })
  userUpdatedAt?: string;

  @Column({
    name: 'fleetId',
    nullable: false,
  })
  fleetId?: number;

  // @OneToMany(() => Module, (module) => module.conversation)
  // modules?: Module[];
}
