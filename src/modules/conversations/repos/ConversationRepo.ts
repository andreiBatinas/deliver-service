import { DeleteResult } from 'typeorm';

import { DB } from '../../../infrastructure/typeorm';
import { Conversation } from '../domain/Conversation';
import { ConversationMap } from '../mappers/ConversationMap';

export interface IConversationRepo {
  findConversationByConversationName(
    name: string,
  ): Promise<Conversation | null>;
  findConversationByConversationId(
    conversationId: string,
  ): Promise<Conversation | null>;
  save(conversation: Conversation): Promise<Conversation>;
  exists(name: string, campaignId: string): Promise<boolean>;
  findConversationsByCampaignId(campaignId: string): Promise<Conversation[]>;

  findModulesByConversationId(conversationId: string): Promise<Conversation[]>;
  removeConversationByConversationId(conversationId: string): Promise<boolean>;
  updateConversation(conversation: Conversation): Promise<Conversation | null>;
}

export class ConversationRepo implements IConversationRepo {
  private models: any;

  constructor(models: any) {
    this.models = models;
  }

  public async exists(name: string,  campaignId: string): Promise<boolean> {
    const conversationModel = this.models.Conversation;
    const r = await DB.getRepository(conversationModel).findOne({ name, campaignId });
    return !!r === true;
  }

  public async findConversationByConversationName(
    name: string,
  ): Promise<Conversation | null> {
    const campaignModel = this.models.Campaign;
    const r = await DB.getRepository(campaignModel).findOne({
      where: {
        name,
      },
    });

    if (undefined === r) {
      return null;
    }
    return ConversationMap.toDomain(r);
  }

  public async save(conversation: Conversation): Promise<Conversation> {
    const conversationModel = this.models.Conversation;
    const rawConversation = ConversationMap.toPersistent(conversation);

    const conversationRepo = DB.getRepository(conversationModel);
    const c = new conversationModel();

    c.conversationId = rawConversation.conversationId;
    c.name = rawConversation.name;
    c.campaignId = rawConversation.campaignId;

    const conversationResult = await conversationRepo.save(c);
    return conversationResult;
  }

  public async findConversationsByCampaignId(
    campaignId: string,
  ): Promise<Conversation[]> {
    const conversationModel = this.models.Conversation;
    const r = await DB.getRepository(conversationModel).find({
      where: {
        campaignId,
      },
    });

    const conversationList = r.map((entry: any) => {
      return ConversationMap.toDomainFromDb(entry);
    });

    return conversationList;
  }
  public async findConversationByConversationId(
    conversationId: string,
  ): Promise<Conversation | null> {
    const conversationModel = this.models.Conversation;
    const conversation = await DB.getRepository(conversationModel).findOne({
      where: {
        conversationId,
      },
      relations: ['modules'],
    });

    if (undefined === conversation) {
      return null;
    }
    return conversation as Conversation;
  }

  public async findModulesByConversationId(
    conversationId: string,
  ): Promise<Conversation[]> {
    const conversationModel = this.models.Conversation;
    const conversation = await DB.getRepository(conversationModel).findOne({
      where: {
        conversationId,
      },
      relations: ['modules'],
    });

    return [];
  }
  public async removeConversationByConversationId(
    conversationId: string,
  ): Promise<boolean> {
    const conversationModel = this.models.Conversation;
    const result: DeleteResult = await DB.getRepository(
      conversationModel,
    ).delete({ conversationId });

    if (result.affected === 0) {
      return false;
    }
    return true;
  }
  public async updateConversation(
    conversation: Conversation,
  ): Promise<Conversation | null> {
    const conversationModel = this.models.Conversation;
    const rawConversation = ConversationMap.toPersistent(conversation);
      const criteria = { conversationId: rawConversation.conversationId };

      const propertiesToUpdate = {
        name: rawConversation.name,
      };
      const result = await DB.getRepository(conversationModel).update(
        criteria,
        propertiesToUpdate,
      );
      if (undefined === result) {
        return null;
      }
      return rawConversation;
  }
}
