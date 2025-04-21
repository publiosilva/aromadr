import { ASTNodeModel } from '../../domain/models';
import { GetLiteralValue } from '../../domain/usecases';

export class GetLiteralValueService implements GetLiteralValue {
  execute(node: ASTNodeModel): string {
    const tokens = this.collectTokens(node);

    tokens.sort((a, b) => {
      if (a.span[0] === b.span[0]) {
        return a.span[1] - b.span[1];
      }

      return a.span[0] - b.span[0];
    });

    let currentLine = 1;
    let currentCol = 1;
    let result = '';

    for (const token of tokens) {
      const [startLine, startCol] = token.span;
      const tokenText = token.value;

      while (currentLine < startLine) {
        result += '\n';
        currentLine++;
        currentCol = 1;
      }

      if (currentCol < startCol) {
        result += ' '.repeat(startCol - currentCol);
        currentCol = startCol;
      }

      result += tokenText;

      if (tokenText.includes('\n')) {
        const lines = tokenText.split('\n');
        currentLine += lines.length - 1;
        currentCol = lines[lines.length - 1].length + 1;
      } else {
        currentCol += tokenText.length;
      }
    }

    return result.trim();
  }

  private collectTokens(node: ASTNodeModel): ASTNodeModel[] {
    let tokens: ASTNodeModel[] = [];

    if (!node.children || node.children.length === 0) {
      if ('span' in node && 'value' in node) {
        tokens.push(node);
      }
    } else {
      for (const child of node.children) {
        tokens = tokens.concat(this.collectTokens(child));
      }
    }

    return tokens;
  }
}
