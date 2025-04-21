import { TestModel, TestSmell, TestSuiteModel } from '../../domain/models';
import { DetectTestSmell } from '../../domain/usecases';

export class DetectDuplicateAssertTestSmellService implements DetectTestSmell {
  execute(testSuite: TestSuiteModel): { test: TestModel, testSmells: TestSmell[] }[] {
    return testSuite.tests.map((test) => {
      const seenAssertionsKeys = new Set<string>();
      const testSmells: TestSmell[] = [];

      test.asserts.forEach((assert) => {
        const assertKey = `${assert.literalActual}-${assert.matcher}-${assert.literalExpected}`;

        if (seenAssertionsKeys.has(assertKey)) {
          testSmells.push({
            endLine: assert.endLine,
            name: 'DuplicateAssert',
            startLine: assert.startLine,
            startColumn: assert.startColumn,
            endColumn: assert.endColumn,
          });
        } else {
          seenAssertionsKeys.add(assertKey);
        }
      });

      return { test, testSmells };
    });
  }
}
