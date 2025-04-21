import { RefactorFileTestSmellController } from '../../../presentation/controllers/refactor-file-test-smell';
import { Controller } from '../../../presentation/protocols';
import { makeRefactorAssertionRouletteTestSmellService, makeRefactorDuplicateAssertTestSmellService } from '../services';

export const makeRefactorFileTestSmellController = (): Controller => {
  const refactorTestSmellServices = new Map([
    ['AssertionRoulette', makeRefactorAssertionRouletteTestSmellService()],
    ['DuplicateAssert', makeRefactorDuplicateAssertTestSmellService()],
  ]);
  const controller = new RefactorFileTestSmellController(
    refactorTestSmellServices
  );

  return controller;
};
