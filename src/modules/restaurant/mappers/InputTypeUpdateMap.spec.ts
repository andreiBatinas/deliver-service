import { expect } from 'chai';
import { InputTypeUpdateMap } from './InputTypeUpdateMap';
const inputTypeId = 1002;
const name = 'test-name';
describe('Mappers', () => {
  describe('InputTypeUpdateMap', () => {
    it('toDomain should return accountId, inputTypeId and name in props', () => {
      const req = {
        name: name,
        input_type_id: inputTypeId
      };
      const expectedResult = {
        name: name,
        inputTypeId: inputTypeId
      };
      const result = InputTypeUpdateMap.toDomain(req);
      expect(result.props).deep.equal(expectedResult);
    });

    it('toPersistent should return accountId, inputTypeId and name ', () => {
      const raw: any = {
        name: name,
        inputTypeId: inputTypeId
      };
      const expectedResult = {
        name: name,
        inputTypeId: inputTypeId
      };
      const result = InputTypeUpdateMap.toPersistent(raw);
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
      const result = InputTypeUpdateMap.toDomainFromDb(raw);
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
      const result = InputTypeUpdateMap.toFrontend(raw);
      expect(result).deep.equal(expectedResult);
    });
  });
});
