import { expect } from 'chai';
import { ConversationMap } from '../oldMapper/ConversationMap';
const campaignId = '00000000-CCCC-1111-3333-222222222222';
const conversationId = '11111111-AAAA-1111-0000-222222222222';
const name = 'test-name';
describe('Mappers', () => {
  describe('ConversationMap', () => {
    it('toDomain should return accountId, conversationId and name in props', () => {
      const req = {
        conversation_id: conversationId,
        name: name,
        account_id: campaignId,
      };
      const expectedResult = {
        conversationId: conversationId,
        campaignId: campaignId,
        name: name,
      };
      const result = ConversationMap.toDomain(req);
      expect(result.props).deep.equal(expectedResult);
    });

    it('toPersistent should return accountId, conversationId and name ', () => {
      const raw: any = {
        conversationId: conversationId,
        campaignId: campaignId,
        name: name,
      };
      const expectedResult = {
        conversationId: conversationId,
        campaignId: campaignId,
        name: name,
      };
      const result = ConversationMap.toPersistent(raw);
      expect(result).deep.equal(expectedResult);
    });

    it('toDomainFromDb should return accountId, conversationId and name in props', () => {
      const raw: any = {
        conversationId: conversationId,
        campaignId: campaignId,
        name: name,
      };
      const expectedResult = {
        conversationId: conversationId,
        campaignId: campaignId,
        name: name,
      };
      const result = ConversationMap.toDomainFromDb(raw);
      expect(result.props).deep.equal(expectedResult);
    });

    it('toFrontend should return account_id, name and conversation_id', () => {
      const raw: any = {
        conversationId: conversationId,
        campaignId: campaignId,
        name: name,
      };
      const expectedResult = {
        conversation_id: conversationId,
        name: name,
        account_id: campaignId,
      };
      const result = ConversationMap.toFrontend(raw);
      expect(result).deep.equal(expectedResult);
    });
  });
});
