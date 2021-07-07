import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { Conversation } from './Conversation';
import { ModuleType } from './ModuleType';

@Entity({ name: 'WCV_modules' })
export class Module {
  @PrimaryColumn({
    name: 'id',
    type: 'uniqueidentifier',
  })
  id?: string;

  @PrimaryColumn({
    name: 'module_guid',
    type: 'uniqueidentifier',
  })
  moduleId?: string;

  @Column({
    nullable: true,
  })
  name?: string;

  @ManyToOne(() => Conversation, (conversation) => conversation.modules)
  @JoinColumn({
    name: 'conversation_guid',
  })
  conversation?: Conversation;

  @ManyToOne(() => ModuleType, (moduleType) => moduleType.modules)
  @JoinColumn({
    name: 'module_type_id',
  })
  moduleType?: ModuleType;

  @Column({
    name: 'next_module_guid',
    nullable: true,
  })
  nextModuleId?: string;

  @UpdateDateColumn({
    name: 'updated_at',
    type: Date,
    nullable: true,
  })
  updatedAt?: string;

  @BeforeInsert()
  generate() {
    this.moduleId = uuidv4();
    this.id = uuidv4();
  }
}
