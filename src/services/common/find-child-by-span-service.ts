import { ASTNodeModel } from '../../domain/models';
import { FindChildBySpan } from '../../domain/usecases';

export class FindChildBySpanService implements FindChildBySpan {
  execute(node: ASTNodeModel, childSpan: number[]): ASTNodeModel | null {
    if (node.span.toString() === childSpan.toString()) {
      return node;
    }

    for (const child of node.children) {
      const foundChild = this.execute(child, childSpan);

      if (foundChild) {
        return foundChild;
      }
    }

    return null;
  }
}
