import { ASTModel, TestSuiteModel } from '../models';

export interface ExtractTestsFromAST {
  execute(ast: ASTModel): TestSuiteModel[];
}
