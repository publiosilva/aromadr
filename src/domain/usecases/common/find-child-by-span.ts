import { ASTNodeModel } from '../../models';

export interface FindChildBySpan {
  execute(node: ASTNodeModel, childSpan: number[]): ASTNodeModel | null;
}
