import { expect } from 'chai';
import { ModuleMap } from '../mappers/ModuleMap';
import { Module } from './Module';
const moduleId = '00000000-CCCC-1111-3333-222222222222';
const nextModuleId = '22222222-CCCC-2222-3333-222222222222';
const conversationId = '11111111-AAAA-1111-0000-222222222222';
const name = 'test-name';
describe('Domain', () => {
  describe('Module', () => {
    it('New with all properties informed should return ok', () => {
      const req = {
        conversation_id: conversationId,
        module_id: moduleId,
        module_name: name,
        module_type: 'Regular',
        next_module_id: nextModuleId,
        updated_at: '2099-01-01',
      };
      const expectResult = {
        isFailure: false,
        isSuccess: true,
        conversationId,
        name,
        moduleType: 'Regular',
        moduleId,
      };
      const module = ModuleMap.toDomain(req);

      const result = Module.New(module);

      expect(result.isFailure).equal(expectResult.isFailure);
      expect(result.isSuccess).equal(expectResult.isSuccess);
      expect(result.getValue()?.moduleType).equal(expectResult.moduleType);
      expect(result.getValue()?.name).equal(expectResult.name);
      expect(result.getValue()?.moduleId).equal(expectResult.moduleId);
    });
  });
});
// Todo: add more tests when the server does not fail due to uninformed properties.
