import { TestModel, TestSmell, TestSuiteModel, TestStatementTypeModel } from '../../domain/models';
import { DetectTestSmell } from '../../domain/usecases';

export class DetectConditionalTestTestSmellService implements DetectTestSmell {
  execute(testSuite: TestSuiteModel): { test: TestModel, testSmells: TestSmell[] }[] {
    return testSuite.tests.map((test) => {
      const testSmells: TestSmell[] = [];
      
      test.statements?.forEach(statement => {
        if (statement.type === TestStatementTypeModel.condition || statement.type === TestStatementTypeModel.loop) {
          testSmells.push({
            name: 'ConditionalTest',
            startLine: statement.startLine,
            startColumn: statement.startColumn,
            endLine: statement.endLine,
            endColumn: statement.endColumn,
          });
        }
      });

      return {
        test,
        testSmells,
      };
    });
  }
}
