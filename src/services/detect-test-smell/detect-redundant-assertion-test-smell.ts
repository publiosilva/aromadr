import { TestSuiteModel, TestSmell, TestModel } from '../../domain/models';
import { DetectTestSmell } from '../../domain/usecases';

export class DetectRedundantAssertionTestSmellService implements DetectTestSmell {
  execute(testSuite: TestSuiteModel): { test: TestModel, testSmells: TestSmell[] }[] {
    return testSuite.tests.map((test) => {
      const testSmells: TestSmell[] = [];

      test.asserts.forEach((assert) => {
        if (assert.literalActual === assert.literalExpected) {
          testSmells.push({
            name: 'RedundantAssertion',
            startLine: assert.startLine,
            endLine: assert.endLine,
            startColumn: assert.startColumn,
            endColumn: assert.endColumn,
          });
        }
      });

      return { test, testSmells };
    });
  }
}
