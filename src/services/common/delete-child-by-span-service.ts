import { ASTNodeModel } from '../../domain/models';
import { DeleteChildBySpan } from '../../domain/usecases';

export class DeleteChildBySpanService implements DeleteChildBySpan {
  execute(node: ASTNodeModel, childSpan: number[]): ASTNodeModel {
    this.removeChildBySpan(node, childSpan.toString());

    return node;
  }

  private removeChildBySpan(node: ASTNodeModel, targetSpan: string): boolean {
    if (node.children) {
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];

        if (child.span.toString() === targetSpan) {
          node.children.splice(i, 1);

          return true;
        }

        if (this.removeChildBySpan(child, targetSpan)) {
          return true;
        }
      }
    }

    return false;
  }
}
