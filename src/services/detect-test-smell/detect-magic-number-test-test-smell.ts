import { TestModel, TestSmell, TestSuiteModel } from '../../domain/models';
import { DetectTestSmell } from '../../domain/usecases';

export class DetectMagicNumberTestTestSmellService implements DetectTestSmell {
  execute(testSuite: TestSuiteModel): { test: TestModel, testSmells: TestSmell[] }[] {
    return testSuite.tests.map((test) => {
      const testSmells: TestSmell[] = [];

      if (test.asserts.length > 1) {
        test.asserts.forEach((assert) => {
          const hasMagicNumber = [assert.literalActual, assert.literalExpected].some((literal) => {
            return !isNaN(Number(literal));
          });

          if (hasMagicNumber) {
            testSmells.push({
              endColumn: assert.endColumn,
              endLine: assert.endLine,
              name: 'MagicNumberTest',
              startColumn: assert.startColumn,
              startLine: assert.startLine,
            });
          }
        });
      }

      return { test, testSmells };
    });
  }
}
