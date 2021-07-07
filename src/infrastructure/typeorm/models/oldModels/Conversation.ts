import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { Module } from './Module';

@Entity({ name: 'WCV_conversations' })
export class Conversation {
  @PrimaryColumn({
    name: 'conversation_guid',
    type: 'uniqueidentifier',
  })
  conversationId?: string;

  @Column({
    nullable: false,
  })
  name?: string;

  @Column({
    name: 'campaign_guid',
    type: 'uniqueidentifier',
    nullable: false,
  })
  campaignId?: string;

  @OneToMany(() => Module, (module) => module.conversation)
  modules?: Module[];

  @BeforeInsert()
  generate() {
    this.conversationId = uuidv4();
  }
}
