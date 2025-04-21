import { ASTNodeModel } from '../../models';

export interface DeleteChildBySpan {
  execute(node: ASTNodeModel, childSpan: number[]): ASTNodeModel;
}
