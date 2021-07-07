import { expect } from 'chai';
import { ConversationMap } from '../../mappers/ConversationMap';
import { Conversation } from './Conversation';
const campaignId = '00000000-CCCC-1111-3333-222222222222';
const conversationId = '11111111-AAAA-1111-0000-222222222222';
const name = 'test-name';
describe('Domain', () => {
  describe('Conversation', () => {
    it('New with all properties informed should return ok', () => {
      const req = {
        account_id: campaignId,
        name: name,
        conversation_id: conversationId,
      };
      const expectResult = {
        isFailure: false,
        isSuccess: true,
        campaignId: campaignId,
        conversationId: conversationId,
        name: name,
      };
      const conversation = ConversationMap.toDomain(req);

      const result = Conversation.New(conversation);

      expect(result.isFailure).equal(expectResult.isFailure);
      expect(result.isSuccess).equal(expectResult.isSuccess);
      expect(result.getValue()?.campaignId).equal(expectResult.campaignId);
      expect(result.getValue()?.conversationId).equal(
        expectResult.conversationId,
      );
      expect(result.getValue()?.name).equal(expectResult.name);
    });
  });
});
// Todo: add more tests when the server does not fail due to uninformed properties.
