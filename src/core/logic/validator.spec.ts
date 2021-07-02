import { expect } from 'chai';
import { Validator } from './';
import { IValidatorResult } from './Validator';

describe('Core:', () => {
  describe('Validator', () => {
    it('Validator should return false', () => {
      const fakeResults: IValidatorResult[] = [
        {
          succeeded: true
        },
        {
          succeeded: false
        }
      ];
      const r = Validator.combine(fakeResults);
      expect(r.succeeded).to.be.equals(false);
    });
    it('Validator should return true', () => {
      const fakeResults: IValidatorResult[] = [
        {
          succeeded: true
        },
        {
          succeeded: true
        }
      ];
      const r = Validator.combine(fakeResults);
      expect(r.succeeded).to.be.equals(true);
    });

    it('Validator checks not null or undefined', () => {
      let r = Validator.notNullOrUndefined(null, 'fake_arg');
      expect(r.succeeded).to.be.equals(false);
      r = Validator.notNullOrUndefined(undefined, 'fake_arg');
      expect(r.succeeded).to.be.equals(false);
    });

    it('Is One Of result ok', () => {
      const r = Validator.isOneOf('fake', ['fake', 'fake_second'], 'fake_arg');
      expect(r.succeeded).to.be.equals(true);
    });

    it('Is One Of result false', () => {
      const r = Validator.isOneOf(
        'fake_third',
        ['fake, fake_second'],
        'fake_arg'
      );
      expect(r.succeeded).to.be.equals(false);
    });
  });
});
