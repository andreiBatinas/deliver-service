import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ModuleInput } from './ModuleInput';

@Entity({ name: 'WCV_variables' })
export class Variable {
  @PrimaryColumn({
    name: 'id',
    type: 'uniqueidentifier',
  })
  id?: string;

  @PrimaryColumn({
    name: 'variable_guid',
    type: 'uniqueidentifier',
  })
  variableId?: string;

  @Column({
    nullable: true,
  })
  name?: string;

  @Column({
    name: 'is_mandatory',
    nullable: false,
  })
  isMandatory?: number;

  @Column({
    name: 'is_special',
    nullable: false,
  })
  isSpecial?: number;

  @OneToMany(() => ModuleInput, (moduleInput) => moduleInput.inputId)
  moduleInputs?: ModuleInput[];

  @BeforeInsert()
  generate() {
    this.variableId = uuidv4();
  }
}
