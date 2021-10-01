import { expect } from 'chai';
import { ConversationCampaignMap } from './ConversationCampaignMap';
const campaignId = '00000000-CCCC-1111-3333-222222222222';
const conversationId = '11111111-AAAA-1111-0000-222222222222';
const name = 'test-name';
describe('Mappers', () => {
  describe('CampaignIdMap', () => {
    it('toDomain should return campaignId and conversationId', () => {
      const req = {
        account_id: campaignId,
        conversation_id: conversationId,
      };
      const expectResult = {
        campaignId: campaignId,
        conversationId: conversationId,
      };
      const result = ConversationCampaignMap.toDomain(req);
      expect(result).deep.equal(expectResult);
    });

    it('toPersistent should return campaignId and conversationId', () => {
      const raw: any = {
        campaignId: campaignId,
        conversationId: conversationId,
      };
      const expectResult = {
        campaignId: campaignId,
        conversationId: conversationId,
      };
      const result = ConversationCampaignMap.toPersistent(raw);

      expect(result).deep.equal(expectResult);
    });

    it('toFrontend should return account_id and conversation_id', () => {
      const raw: any = {
        campaignId: campaignId,
        conversationId: conversationId,
      };
      const expectResult = {
        account_id: campaignId,
        conversation_id: conversationId,
      };
      const result = ConversationCampaignMap.toFrontend(raw);
      expect(result).deep.equal(expectResult);
    });
  });
});
