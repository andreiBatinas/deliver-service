import { expect } from 'chai';
import { InputTypeMap } from '../../mappers/InputTypeMap';
import { InputType } from '../oldDomain/InputType';
const name = 'test-name';
describe('Domain', () => {
  describe('InputType', () => {
    it('New with all properties informed should return ok', () => {
      const req = {
        name: name,
      };
      const expectResult = {
        isFailure: false,
        isSuccess: true,
        name: name,
        modules: [],
      };
      const inputType = InputTypeMap.toDomain(req);

      const result = InputType.New(inputType);
      expect(result.isFailure).equal(expectResult.isFailure);
      expect(result.isSuccess).equal(expectResult.isSuccess);
      expect(result.getValue()?.name).equal(expectResult.name);
    });
  });
});
// Todo: add more tests when the server does not fail due to uninformed properties.
