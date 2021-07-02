import { expect } from 'chai';

import { GenericErrors } from './';

describe('Core', () => {
  describe('Logic', () => {
    describe('App Error', () => {
      it('Should create instance', () => {
        const r = GenericErrors.UnexpectedError.create('fake_error');
        expect(r).to.be.instanceOf(GenericErrors.UnexpectedError);
      });
    });
  });
});
