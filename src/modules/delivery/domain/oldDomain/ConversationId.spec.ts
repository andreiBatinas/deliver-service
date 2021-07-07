import { expect } from 'chai';
import { ConversationIdMap } from '../../mappers/ConversationIdMap';
import { ConversationId } from '../oldDomain/ConversationId';
const campaignId = '00000000-CCCC-1111-3333-222222222222';
const conversationId = '11111111-AAAA-1111-0000-222222222222';
const name = 'test-name';
describe('Domain', () => {
  describe('ConversationId', () => {
    it('New with all properties informed should return ok', () => {
      const req = {
        conversation_id: conversationId,
      };
      const expectResult = {
        isFailure: false,
        isSuccess: true,
        conversationId: conversationId,
      };
      const conversation = ConversationIdMap.toDomain(req);

      const result = ConversationId.New(conversation);

      expect(result.isFailure).equal(expectResult.isFailure);
      expect(result.isSuccess).equal(expectResult.isSuccess);
      expect(result.getValue()?.conversationId).equal(
        expectResult.conversationId,
      );
    });
  });
});
// Todo: add more tests when the server does not fail due to uninformed properties.
