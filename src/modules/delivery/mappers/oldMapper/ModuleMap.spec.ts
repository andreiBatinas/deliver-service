import { expect } from 'chai';
import { ModuleMap } from '../oldMapper/ModuleMap';
const campaignId = '00000000-CCCC-1111-3333-222222222222';
const conversationId = '11111111-AAAA-1111-0000-222222222222';
const moduleId = '22222222-AAAA-1111-0000-222222222222';
const moduleType = 'Regular';
const updatedAt = '2099-01-01';
const nextModuleId = '33333333-AAAA-1111-0000-222222222222';
const prompt = 'prompt text';
const name = 'test-name';

describe('Mappers', () => {
  describe('ModuleMap', () => {
    it('toDomain should return accountId, conversationId and name in props', () => {
      const req = {
        module_id: moduleId,
        conversation_id: conversationId,
        module_name: name,
        prompt: prompt,
        module_type: moduleType,
        next_module_id: nextModuleId,
        updated_at: updatedAt,
      };
      const expectedResult = {
        conversation: conversationId,
        moduleId: moduleId,
        name: name,
        prompt: prompt,
        nextModuleId: nextModuleId,
        updatedAt: updatedAt,
        moduleType: moduleType,
      };
      const result = ModuleMap.toDomain(req);
      expect(result.props).deep.equal(expectedResult);
    });

    it('toPersistent should return a module', () => {
      const raw: any = {
        name: name,
        prompt: prompt,
        moduleType: moduleType,
        nextModuleId: nextModuleId,
      };
      const expectedResult = {
        name: name,
        prompt: prompt,
        nextModuleId: nextModuleId,
        updatedAt: updatedAt,
        moduleType: moduleType,
      };
      const result = ModuleMap.toPersistent(raw);
      expect(result.name).equal(expectedResult.name);
      expect(result.prompt).equal(expectedResult.prompt);
      expect(result.nextModuleId).equal(expectedResult.nextModuleId);
      expect(result.moduleType).equal(expectedResult.moduleType);
    });

    it('toDomainFromDb should return accountId, conversationId and name in props', () => {
      const raw: any = {
        moduleId: moduleId,
        conversationId: conversationId,
        name: name,
        prompt: prompt,
        moduleType: moduleType,
        nextModuleId: nextModuleId,
        updatedAt: updatedAt,
      };
      const expectedResult = {
        moduleId: moduleId,
        conversation: conversationId,
        name: name,
        prompt: prompt,
        moduleType: moduleType,
        nextModuleId: nextModuleId,
        updatedAt: updatedAt,
      };
      const result = ModuleMap.toDomainFromDb(raw);
      expect(result.props).deep.equal(expectedResult);
    });

    it('toFrontend should return account_id, name and conversation_id', () => {
      const raw: any = {
        moduleId: moduleId,
        name: name,
        conversation: { conversationId: conversationId },
        prompt: prompt,
        nextModuleId: nextModuleId,
        updatedAt: updatedAt,
        moduleType: moduleType,
      };
      const expectedResult = {
        module_id: moduleId,
        module_name: name,
        conversation_id: conversationId,
        prompt: prompt,
        module_type: moduleType,
        next_module_id: nextModuleId,
        updated_at: updatedAt,
      };
      const result = ModuleMap.toFrontend(raw);
      expect(result).deep.equal(expectedResult);
    });
  });
});
