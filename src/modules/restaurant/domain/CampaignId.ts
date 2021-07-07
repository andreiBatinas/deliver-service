import { Entity, UniqueEntityId } from '../../../core/domain';
import { Result, Validator } from '../../../core/logic';

interface CampaignIdProps {
  campaignId: string;
}

export class CampaignId extends Entity<CampaignIdProps> {
  get campaignId(): string {
    return this.props.campaignId;
  }

  constructor(props: CampaignIdProps, id?: UniqueEntityId) {
    super(props, id);
  }

  // tslint:disable-next-line: function-name
  static New(props: CampaignIdProps, id?: UniqueEntityId): Result<CampaignId> {
    const validator = Validator.notNullOrUndefinedBulk([
      { arg: props.campaignId, argName: 'campaignId' },
    ]);

    if (false === validator.succeeded) {
      return Result.Fail<CampaignId>(validator.message);
    }
    const conversation = new CampaignId(props, id);
    return Result.OK<CampaignId>(conversation);
  }
}
