import { ASTModel, ASTNodeModel, TestAssertModel, TestEventModel, TestEventTypeModel, TestSuiteModel } from '../../domain/models';
import { ExtractTestsFromAST, FindAllFunctionOrMethodInvocations, GetAllStatements, GetLiteralValue } from '../../domain/usecases';

export class ExtractTestsFromJavaScriptJestASTService implements ExtractTestsFromAST {
  private readonly testMethods = ['it', 'test'];

  private readonly assertMethods = ['expect'];

  private readonly printMethods = ['console.log'];

  private readonly sleepMethods = ['setTimeout', 'setInterval'];

  private readonly disableAnnotations = ['skip', 'xtest', 'xit'];

  constructor(
    private findAllMethodInvocations: FindAllFunctionOrMethodInvocations,
    private getLiteralValue: GetLiteralValue,
    private getAllStatements: GetAllStatements,
  ) { }

  execute(ast: ASTModel): TestSuiteModel[] {
    const testSuitesMap: Map<string, TestSuiteModel> = new Map([
      ['File Level Test Suite', {
        isExclusive: false,
        isIgnored: false,
        name: 'File Level Test Suite',
        tests: [],
      }],
    ]);
    const methodInvocations = this.findAllMethodInvocations.execute(ast);
    const testInvocations = methodInvocations.filter(invocation =>
      this.testMethods.includes(invocation.identifier)
    );

    testInvocations.forEach(testInvocation => {
      const testName = testInvocation.parameterNodes?.[0] ? this.getLiteralValue.execute(testInvocation.parameterNodes?.[0]) : '';
      const testFunction = testInvocation.parameterNodes?.[1];
      const asserts = testFunction ? this.extractAsserts(testFunction) : [];
      const test = {
        asserts,
        endLine: testInvocation.node.span[2],
        events: testFunction ? this.extractEvents(testFunction) : [],
        isExclusive: false,
        isIgnored: this.disableAnnotations.includes(testInvocation.identifier),
        name: testName,
        startLine: testInvocation.node.span[0],
        startColumn: testInvocation.node.span[1],
        endColumn: testInvocation.node.span[3],
        statements: testFunction ? this.getAllStatements.execute(testFunction) : [],
      };

      testSuitesMap.get('File Level Test Suite')?.tests.push(test);
    });

    return Array.from(testSuitesMap.values());
  }

  private extractAsserts(node: ASTNodeModel): TestAssertModel[] {
    const methodInvocations = this.findAllMethodInvocations.execute(node);

    return methodInvocations
      .filter(invocation => this.assertMethods.includes(invocation.identifier))
      .map(assertInvocation => {
        if (!assertInvocation.parameterNodes?.length || !assertInvocation.chained?.identifier) return null;
        const literalActual = this.getLiteralValue.execute(assertInvocation.parameterNodes[0]);
        const matcher = assertInvocation.chained.identifier;
        const literalExpected = assertInvocation.chained.parameterNodes && assertInvocation.chained.parameterNodes.length > 0
          ? this.getLiteralValue.execute(assertInvocation.chained.parameterNodes[0])
          : undefined;

        return {
          literalActual,
          literalExpected,
          matcher,
          endLine: assertInvocation.node.span[2],
          startLine: assertInvocation.node.span[0],
          startColumn: assertInvocation.node.span[1],
          endColumn: assertInvocation.node.span[3],
        };
      })
      .filter((assert): assert is NonNullable<typeof assert> => assert !== null);
  }

  private extractEvents(node: ASTNodeModel): TestEventModel[] {
    const methodInvocations = this.findAllMethodInvocations.execute(node);
    const events: TestEventModel[] = [];

    methodInvocations.forEach(invocation => {
      if (this.printMethods.includes(invocation.identifier)) {
        events.push({
          name: invocation.identifier,
          type: TestEventTypeModel.print,
          endLine: invocation.node.span[2],
          startLine: invocation.node.span[0],
          startColumn: invocation.node.span[1],
          endColumn: invocation.node.span[3],
        });
      } else if (this.sleepMethods.includes(invocation.identifier)) {
        events.push({
          name: invocation.identifier,
          type: TestEventTypeModel.sleep,
          endLine: invocation.node.span[2],
          startLine: invocation.node.span[0],
          startColumn: invocation.node.span[1],
          endColumn: invocation.node.span[3],
        });
      } else if (this.assertMethods.includes(invocation.identifier)) {
        events.push({
          name: invocation.identifier,
          type: TestEventTypeModel.assert,
          endLine: invocation.node.span[2],
          startLine: invocation.node.span[0],
          startColumn: invocation.node.span[1],
          endColumn: invocation.node.span[3],
        });
      } else {
        events.push({
          name: invocation.identifier,
          type: TestEventTypeModel.unknown,
          endLine: invocation.node.span[2],
          startLine: invocation.node.span[0],
          startColumn: invocation.node.span[1],
          endColumn: invocation.node.span[3],
        });
      }
    });

    return events;
  }
}
