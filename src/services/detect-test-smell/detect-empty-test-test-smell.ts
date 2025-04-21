import { TestModel, TestSmell, TestSuiteModel } from '../../domain/models';
import { DetectTestSmell } from '../../domain/usecases';

export class DetectEmptyTestTestSmellService implements DetectTestSmell {
  execute(testSuite: TestSuiteModel): { test: TestModel, testSmells: TestSmell[] }[] {
    return testSuite.tests.map((test) => {
      const testSmells: TestSmell[] = [];

      if (test.statements?.length === 0) {
        testSmells.push({
          name: 'EmptyTest',
          startLine: test.startLine,
          startColumn: test.startColumn,
          endLine: test.endLine,
          endColumn: test.endColumn,
        });
      }

      return {
        test,
        testSmells,
      };
    });
  }
}