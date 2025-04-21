import { ASTModel, TestModel, TestSmell } from '../models';

export interface RefactorTestSmell {
  execute(ast: ASTModel, test: TestModel, testSmell: TestSmell): string;
}
