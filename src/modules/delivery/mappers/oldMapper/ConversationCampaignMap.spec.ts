import { expect } from 'chai';
import { CampaignIdMap } from './CampaignIdMap';
const campaignId = '00000000-CCCC-1111-3333-222222222222';
const name = 'test-name';
describe('Mappers', () => {
  describe('ConversationCampaignMap', () => {
    it('toDomain should return campaignId in props', () => {
      const req = {
        account_id: campaignId,
      };
      const expectedResult = {
        campaignId: campaignId,
      };
      const result = CampaignIdMap.toDomain(req);
      expect(result.props).deep.equal(expectedResult);
    });

    it('toPersistent should return campaignId in props', () => {
      const raw: any = {
        campaignId: campaignId,
      };
      const expectedResult = {
        campaignId: campaignId,
      };
      const result = CampaignIdMap.toPersistent(raw);

      expect(result).deep.equal(expectedResult);
    });

    it('toFrontend should return account_id in props', () => {
      const raw: any = {
        campaignId: campaignId,
      };
      const expectedResult = {
        account_id: campaignId,
      };
      const result = CampaignIdMap.toFrontend(raw);
      expect(result).deep.equal(expectedResult);
    });
  });
});
