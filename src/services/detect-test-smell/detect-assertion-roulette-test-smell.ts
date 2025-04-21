import { TestModel, TestSmell, TestSuiteModel } from '../../domain/models';
import { DetectTestSmell } from '../../domain/usecases';

export class DetectAssertionRouletteTestSmellService implements DetectTestSmell {
  execute(testSuite: TestSuiteModel): { test: TestModel, testSmells: TestSmell[] }[] {
    return testSuite.tests.map((test) => {
      const testSmells: TestSmell[] = [];

      if (test.asserts.length > 1) {
        test.asserts.forEach((assert) => {
          if (!assert.message) {
            testSmells.push({
              endColumn: assert.endColumn,
              endLine: assert.endLine,
              name: 'AssertionRoulette',
              startColumn: assert.startColumn,
              startLine: assert.startLine,
            });
          }
        });
      }

      return {
        test,
        testSmells,
      };
    });
  }
}
