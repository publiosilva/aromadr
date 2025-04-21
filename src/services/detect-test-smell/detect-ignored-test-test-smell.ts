import { TestSmell, TestSuiteModel, TestModel } from '../../domain/models';
import { DetectTestSmell } from '../../domain/usecases';

export class DetectIgnoredTestTestSmellService implements DetectTestSmell {
  execute(testSuite: TestSuiteModel): { test: TestModel, testSmells: TestSmell[] }[] {
    const results: { test: TestModel, testSmells: TestSmell[] }[] = [];

    for (const test of testSuite.tests) {
      const testSmells: TestSmell[] = [];

      if (testSuite.isIgnored || test.isIgnored) {
        testSmells.push({
          name: 'IgnoredTest',
          startLine: test.startLine,
          endLine: test.endLine,
          startColumn: test.startColumn,
          endColumn: test.endColumn,
        });
      }

      const exclusiveTests = testSuite.tests.filter(t => t.isExclusive);

      if (exclusiveTests.length > 0 && !test.isExclusive) {
        testSmells.push({
          name: 'IgnoredTest',
          startLine: test.startLine,
          endLine: test.endLine,
          startColumn: test.startColumn,
          endColumn: test.endColumn,
        });
      }

      results.push({ test, testSmells });
    }

    return results;
  }
}
