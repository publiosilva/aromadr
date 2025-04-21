import { ASTNodeModel, TestStatementModel } from '../../models';

export interface GetAllStatements {
  execute(node: ASTNodeModel): TestStatementModel[];
}
