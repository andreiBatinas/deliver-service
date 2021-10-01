import { expect } from 'chai';
import { InputTypeMap } from '../oldMapper/InputTypeMap';
const inputTypeId = '11111111-AAAA-1111-0000-222222222222';
const name = 'test-name';
describe('Mappers', () => {
  describe('InputTypeMap', () => {
    it('toDomain should return accountId, inputTypeId and name in props', () => {
      const req = {
        name: name,
      };
      const expectedResult = {
        name: name,
      };
      const result = InputTypeMap.toDomain(req);
      expect(result.props).deep.equal(expectedResult);
    });

    it('toPersistent should return accountId, inputTypeId and name ', () => {
      const raw: any = {
        name: name,
      };
      const expectedResult = {
        name: name,
      };
      const result = InputTypeMap.toPersistent(raw);
      expect(result).deep.equal(expectedResult);
    });

    it('toDomainFromDb should return accountId, inputTypeId and name in props', () => {
      const raw: any = {
        inputTypeId: inputTypeId,
        name: name,
      };
      const expectedResult = {
        inputTypeId: inputTypeId,
        name: name,
        modules: [],
      };
      const result = InputTypeMap.toDomainFromDb(raw);
      expect(result.props).deep.equal(expectedResult);
    });

    it('toFrontend should return account_id, name and inputType_id', () => {
      const raw: any = {
        inputTypeId: inputTypeId,
        name: name,
        modules: [],
      };
      const expectedResult = {
        input_type_id: inputTypeId,
        name: name,
        modules: [],
      };
      const result = InputTypeMap.toFrontend(raw);
      expect(result).deep.equal(expectedResult);
    });
  });
});
