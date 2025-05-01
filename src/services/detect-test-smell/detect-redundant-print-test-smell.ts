import { TestSuiteModel, TestSmell, TestEventTypeModel, TestModel } from '../../domain/models';
import { DetectTestSmell } from '../../domain/usecases';

export class DetectRedundantPrintTestSmellService implements DetectTestSmell {
  execute(testSuite: TestSuiteModel): { test: TestModel, testSmells: TestSmell[] }[] {
    const results: { test: TestModel, testSmells: TestSmell[] }[] = [];

    for (const test of testSuite.tests) {
      const testSmells: TestSmell[] = [];
      
      const printEvent = test.events.find(({ type }) => type === TestEventTypeModel.print);
      
      if (printEvent) {
        testSmells.push({
          name: 'RedundantPrint',
          startLine: printEvent.startLine,
          endLine: printEvent.endLine,
          startColumn: printEvent.startColumn,
          endColumn: printEvent.endColumn,
        });
      }
      
      results.push({ test, testSmells });
    }

    return results;
  }
}
