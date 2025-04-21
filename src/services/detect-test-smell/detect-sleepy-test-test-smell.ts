import { TestSuiteModel, TestSmell, TestEventTypeModel, TestModel } from '../../domain/models';
import { DetectTestSmell } from '../../domain/usecases';

export class DetectSleepyTestTestSmellService implements DetectTestSmell {
  execute(testSuite: TestSuiteModel): { test: TestModel, testSmells: TestSmell[] }[] {
    const results: { test: TestModel, testSmells: TestSmell[] }[] = [];

    for (const test of testSuite.tests) {
      const testSmells: TestSmell[] = [];
      
      const sleepEvent = test.events.find(({ type }) => type === TestEventTypeModel.sleep);
      
      if (sleepEvent) {
        testSmells.push({
          name: 'SleepyTest',
          startLine: sleepEvent.startLine,
          endLine: sleepEvent.endLine,
          startColumn: sleepEvent.startColumn,
          endColumn: sleepEvent.endColumn,
        });
      }
      
      results.push({ test, testSmells });
    }

    return results;
  }
}
