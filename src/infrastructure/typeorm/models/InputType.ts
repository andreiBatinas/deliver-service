import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Module } from './Module';
import { ModuleInput } from './ModuleInput';

@Entity({ name: 'WCV_input_types' })
export class InputType {
  @PrimaryGeneratedColumn({
    name: 'input_type_id',
  })
  inputTypeId?: number;

  @Column({
    nullable: false,
  })
  name?: string;

  @OneToMany(() => ModuleInput, (moduleInput) => moduleInput.inputId)
  modules?: Module[];
}
