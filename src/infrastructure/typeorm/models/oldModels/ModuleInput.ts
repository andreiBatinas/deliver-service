import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { InputType } from './InputType';
import { Module } from './Module';
import { Variable } from './Variable';

@Entity({ name: 'WCV_module_inputs' })
export class ModuleInput {
  @PrimaryColumn({
    name: 'id',
    type: 'uniqueidentifier',
  })
  id?: string;

  @PrimaryColumn({
    name: 'input_guid',
    type: 'uniqueidentifier',
  })
  inputId?: string;

  @Column({
    nullable: false,
  })
  text?: string;

  @Column({
    nullable: false,
  })
  buttonText?: string;

  @OneToOne(() => Module, (module) => module.moduleId)
  @JoinColumn({
    name: 'module_guid',
  })
  moduleId?: string;

  @ManyToOne(() => Variable, (variable) => variable.variableId)
  @JoinColumn({
    name: 'variable_guid',
  })
  variableId?: string;

  @Column({
    name: 'updated_at',
    nullable: false,
  })
  updatedAt?: string;

  @ManyToOne(() => InputType, (inputType) => inputType.inputTypeId)
  @JoinColumn({
    name: 'input_type_id',
  })
  inputTypeId?: string;

  @OneToMany(() => Module, (module) => module.conversation)
  modules?: Module[];

  @BeforeInsert()
  generate() {
    this.inputId = uuidv4();
  }
}
