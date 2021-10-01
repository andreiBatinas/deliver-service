import { expect } from 'chai';
import { Identifier } from './';

describe('Core', () => {
  describe('Identifier', () => {
    describe('As number', () => {
      let id: Identifier<number>;
      beforeEach(() => {
        id = new Identifier<number>(0);
      });
      it('Should create instance', () => {
        expect(id).to.be.instanceOf(Identifier);
      });
      it('Should be a number', () => {
        expect(id.toValue()).to.be.a('number');
      });
      it('Should return a string', () => {
        expect(id.toString()).to.be.a('string');
      });
      it('Should be false', () => {
        expect(id.equals()).to.be.equals(false);
      });
      it('Should be true', () => {
        expect(id.equals(id)).to.be.equals(true);
      });
      it('Should be false', () => {
        const fakeId = new Identifier<number>(1);
        expect(id.equals(fakeId)).to.be.equals(false);
      });
    });
    describe('As string', () => {
      let id: Identifier<string>;
      beforeEach(() => {
        id = new Identifier<string>('fake_string');
      });
      it('Should create instance', () => {
        expect(id).to.be.instanceOf(Identifier);
      });
      it('Should be a string', () => {
        expect(id.toValue()).to.be.a('string');
      });
      it('Should be false', () => {
        expect(id.equals()).to.be.equals(false);
      });
      it('Should be true', () => {
        expect(id.equals(id)).to.be.equals(true);
      });
      it('Should be false', () => {
        const fakeId = new Identifier<string>('fake_string_2');
        expect(id.equals(fakeId)).to.be.equals(false);
      });
    });
  });
});
