import { expect } from 'chai';
import { CampaignIdMap } from '../../mappers/CampaignIdMap';
import { CampaignId } from './CampaignId';
const campaignId = '00000000-CCCC-1111-3333-222222222222';
const conversationId = '11111111-AAAA-1111-0000-222222222222';
const name = 'test-name';
describe('Domain', () => {
  describe('CampaignId', () => {
    it('New with property informed should return ok', () => {
      const req = {
        account_id: campaignId,
      };
      const expectResult = {
        isFailure: false,
        isSuccess: true,
        campaignId: campaignId,
      };
      const campaign = CampaignIdMap.toDomain(req);

      const result = CampaignId.New(campaign);

      expect(result.isFailure).equal(expectResult.isFailure);
      expect(result.isSuccess).equal(expectResult.isSuccess);
      expect(result.getValue()?.campaignId).equal(expectResult.campaignId);
    });
  });
});
// Todo: add more tests when the server does not fail due to uninformed properties.
