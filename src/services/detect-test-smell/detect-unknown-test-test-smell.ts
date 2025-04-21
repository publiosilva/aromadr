import { TestModel, TestSmell, TestSuiteModel } from '../../domain/models';
import { DetectTestSmell } from '../../domain/usecases';

export class DetectUnknownTestTestSmellService implements DetectTestSmell {
  execute(testSuite: TestSuiteModel): { test: TestModel, testSmells: TestSmell[] }[] {
    return testSuite.tests.map((test) => {
      const testSmells: TestSmell[] = [];

      if (!test.asserts.length) {
        testSmells.push({
          endColumn: test.endColumn,
          endLine: test.endLine,
          name: 'UnknownTest',
          startColumn: test.startColumn,
          startLine: test.startLine,
        });
      }

      return { test, testSmells };
    });
  }
}
