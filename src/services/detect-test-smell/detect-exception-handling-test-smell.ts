import { DetectTestSmell } from '../../domain/usecases';
import { TestModel, TestSuiteModel, TestStatementTypeModel, TestSmell } from '../../domain/models';

export class DetectExceptionHandlingTestSmellService implements DetectTestSmell {
  execute(testSuite: TestSuiteModel): { test: TestModel; testSmells: TestSmell[] }[] {
    return testSuite.tests.map((test) => {
      const testSmells: TestSmell[] = [];
      
      test.statements?.forEach(statement => {
        if (statement.type === TestStatementTypeModel.exceptionHandling || statement.type === TestStatementTypeModel.exceptionThrowing) {
          testSmells.push({
            name: 'ExceptionHandling',
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
