import { expect } from 'chai';
import { ConversationCampaignMap } from '../mappers/ConversationCampaignMap';
import { ConversationCampaign } from './ConversationCampaign';
const campaignId = '00000000-CCCC-1111-3333-222222222222';
const conversationId = '11111111-AAAA-1111-0000-222222222222';
const name = 'test-name';
describe('Domain', () => {
  describe('Conversation', () => {
    it('New with all properties informed should return ok', () => {
      const req = {
        account_id: campaignId,
        conversation_id: conversationId,
      };
      const expectResult = {
        isFailure: false,
        isSuccess: true,
        conversationId: conversationId,
      };
      const conversation = ConversationCampaignMap.toDomain(req);

      const result = ConversationCampaign.New(conversation);

      expect(result.isFailure).equal(expectResult.isFailure);
      expect(result.isSuccess).equal(expectResult.isSuccess);
      expect(result.getValue()?.conversationId).equal(
        expectResult.conversationId,
      );
    });
  });
});
// Todo: add more tests when the server does not fail due to uninformed properties.
