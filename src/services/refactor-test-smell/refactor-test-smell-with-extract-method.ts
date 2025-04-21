import { ASTModel, ASTNodeModel, TestAssertModel, TestModel, TestSmell } from '../../domain/models';
import { DeleteChildBySpan, FindChildBySpan, GetLiteralValue, RefactorTestSmell, ReplaceTextInSpan } from '../../domain/usecases';

export class RefactorTestSmellWithExtractMethodService implements RefactorTestSmell {
  constructor(
    private readonly findChildBySpan: FindChildBySpan,
    private readonly deleteChildBySpan: DeleteChildBySpan,
    private readonly getLiteralValue: GetLiteralValue,
    private readonly replaceTextInSpan: ReplaceTextInSpan,
  ) { }

  execute(ast: ASTModel, test: TestModel, testSmell: TestSmell): string {
    const astText = this.getLiteralValue.execute(ast);
    const testNode = this.findChildBySpan.execute(ast, [
      test.startLine,
      test.startColumn,
      test.endLine,
      test.endColumn,
    ]);

    if (testNode) {
      const assertNode = this.findChildBySpan.execute(testNode, [
        testSmell.startLine,
        testSmell.startColumn,
        testSmell.endLine,
        testSmell.endColumn,
      ]);

      if (assertNode) {
        const oldTestNode = JSON.parse(JSON.stringify(testNode));
        const oldTestNodeWithoutDuplicatedAssert = this.deleteChildBySpan.execute(oldTestNode, assertNode.span);
        const oldTestNodeWithoutDuplicatedAssertText = this.getLiteralValue.execute(oldTestNodeWithoutDuplicatedAssert);
        const newTestNode = JSON.parse(JSON.stringify(testNode));
        const newTestNodeWithoutUnnecessaryNodes = this.deleteAssertsFromNode(newTestNode, test.asserts.filter((assert) => {
          return JSON.stringify([
            assert.startLine,
            assert.startColumn,
            assert.endLine,
            assert.endColumn,
          ]) !== JSON.stringify(assertNode.span);
        }));
        const newTestNodeWithoutUnnecessaryNodesText = this.getLiteralValue
          .execute(newTestNodeWithoutUnnecessaryNodes)
          .replace(test.name, `${test.name}_refactored_${new Date().toISOString().replace(/[-T:.Z]/g, '').slice(0, 14)}`);
        const newContent = [oldTestNodeWithoutDuplicatedAssertText, newTestNodeWithoutUnnecessaryNodesText].join('\n\n');
        const refactoredAstText = this.replaceTextInSpan.execute(astText, testNode.span, newContent);

        return refactoredAstText.replace(/\n{3,}/g, '\n\n');
      } 
    }

    return astText;
  }

  private deleteAssertsFromNode(node: ASTNodeModel, asserts: TestAssertModel[]): ASTNodeModel {
    let newNode = JSON.parse(JSON.stringify(node));

    asserts.forEach((assert) => {
      newNode = this.deleteChildBySpan.execute(node, [
        assert.startLine,
        assert.startColumn,
        assert.endLine,
        assert.endColumn,
      ]);
    });

    return newNode;
  }
}
