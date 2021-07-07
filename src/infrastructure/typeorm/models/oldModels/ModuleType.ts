import {
  Column,
  Entity,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';

import { Module } from './Module';

@Entity({ name: 'WCV_module_types' })
export class ModuleType {
  @PrimaryColumn({
    name: 'module_type_id',
    type: 'int',
  })
  moduleTypeId?: number;

  @Column({
    nullable: false,
  })
  name?: string;

  @OneToMany(() => Module, (module) => module.moduleType)
  modules?: Module[];
}
