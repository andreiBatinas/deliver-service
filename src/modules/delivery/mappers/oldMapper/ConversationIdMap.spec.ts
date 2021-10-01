import { expect } from 'chai';
import { ConversationIdMap } from '../oldMapper/ConversationIdMap';
const campaignId = '00000000-CCCC-1111-3333-222222222222';
const conversationId = '11111111-AAAA-1111-0000-222222222222';
const name = 'test-name';
describe('Mappers', () => {
  describe('ConversationIdMap', () => {
    it('toDomain should return conversationId', () => {
      const req = {
        conversation_id: conversationId,
      };
      const expectedResult = {
        conversationId: conversationId,
      };
      const result = ConversationIdMap.toDomain(req);
      expect(result).deep.equal(expectedResult);
    });

    it('toPersistent should return conversationId', () => {
      const raw: any = {
        conversationId: conversationId,
      };
      const expectedResult = {
        conversationId: conversationId,
      };
      const result = ConversationIdMap.toPersistent(raw);

      expect(result).deep.equal(expectedResult);
    });
  });
});
