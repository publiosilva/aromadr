import { ASTNodeModel, TestStatementModel, TestStatementTypeModel } from '../../domain/models';
import { GetAllStatements } from '../../domain/usecases';

export class GetAllStatementsService implements GetAllStatements {
  execute(node: ASTNodeModel): TestStatementModel[] {
    const statements: TestStatementModel[] = [];
    const blockNodes: ASTNodeModel[] = [];

    const findBlockNodes = (node: ASTNodeModel) => {
      if (!node.children) {
        return;
      }

      node.children.forEach(child => {
        if (child.type === 'block' || child.type === 'statement_block') {
          blockNodes.push(child);
        }

        findBlockNodes(child);
      });
    };

    findBlockNodes(node);

    if (blockNodes.length === 0) {
      return statements;
    }

    const processNode = (node: ASTNodeModel) => {
      if (!node.children) {
        return;
      }

      node.children.forEach(child => {
        if (!['{', '}'].includes(child.type)) {
          let type = TestStatementTypeModel.other;

          switch (child.type) {
            case 'local_variable_declaration':
              type = TestStatementTypeModel.assignment;
              break;
            case 'expression_statement':
              if (child.children?.some(child => child.type === 'method_invocation')) {
                type = TestStatementTypeModel.call;
              }

              break;
            case 'if_statement':
            case 'switch_statement':
              type = TestStatementTypeModel.condition;
              break;
            case 'do_statement':
            case 'while_statement':
            case 'for_statement':
            case 'enhanced_for_statement':
              type = TestStatementTypeModel.loop;
              break;
            case 'try_statement':
              type = TestStatementTypeModel.exceptionHandling;
              break;
            case 'throw_statement':
              type = TestStatementTypeModel.exceptionThrowing;
              break;
          }

          statements.push({
            type,
            startLine: child.span[0],
            endLine: child.span[2],
            startColumn: child.span[1],
            endColumn: child.span[3],
          });
        }
      });
    };

    blockNodes.forEach(blockNode => processNode(blockNode));

    return statements.sort((a, b) => a.startLine - b.startLine);
  }
}
