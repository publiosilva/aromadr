import { ASTModel, ASTNodeModel, FunctionOrMethodInvocationModel, TestAssertModel, TestEventModel, TestEventTypeModel, TestSuiteModel } from '../../domain/models';
import { ExtractTestsFromAST, FindAllClassDeclarations, FindAllFunctionOrMethodDeclarations, FindAllFunctionOrMethodInvocations, GetAllStatements, GetLiteralValue } from '../../domain/usecases';

export class ExtractTestsFromPythonUnittestASTService implements ExtractTestsFromAST {
  private readonly assertMethods = [
    'assertEqual',
    'assertTrue',
    'assertFalse',
    'assertIs',
    'assertIsNot',
    'assertIsNone',
    'assertIsNotNone',
    'assertIn',
    'assertNotIn',
    'assertGreater',
    'assertGreaterEqual',
    'assertLess',
    'assertLessEqual',
    'self.assertEqual',
    'self.assertTrue',
    'self.assertFalse',
    'self.assertIs',
    'self.assertIsNot',
    'self.assertIsNone',
    'self.assertIsNotNone',
    'self.assertIn',
    'self.assertNotIn',
    'self.assertGreater',
    'self.assertGreaterEqual',
    'self.assertLess',
    'self.assertLessEqual',
  ];

  private readonly printMethods = [
    'print',
  ];

  private readonly sleepMethods = [
    'time.sleep',
  ];

  constructor(
    private findAllClassDeclarations: FindAllClassDeclarations,
    private findAllMethodDeclarations: FindAllFunctionOrMethodDeclarations,
    private findAllMethodInvocations: FindAllFunctionOrMethodInvocations,
    private getLiteralValue: GetLiteralValue,
    private getAllStatements: GetAllStatements,
  ) { }

  execute(ast: ASTModel): TestSuiteModel[] {
    const testSuites: TestSuiteModel[] = [];
    const classDeclarations = this.findAllClassDeclarations.execute(ast);

    classDeclarations.forEach((classDeclaration) => {
      if (classDeclaration.superclasses?.includes('unittest.TestCase')) {
        const methodDeclarations = this.findAllMethodDeclarations.execute(classDeclaration.node);

        if (methodDeclarations.some(({ identifier }) => identifier.startsWith('test'))) {
          const testSuite: TestSuiteModel = {
            isExclusive: false,
            isIgnored: classDeclaration.decorators?.some(({ identifier }) => ['skip', 'unittest.skip'].includes(identifier)) || false,
            name: classDeclaration.identifier,
            tests: [],
          };

          methodDeclarations.forEach((methodDeclaration) => {
            if (methodDeclaration?.identifier?.startsWith('test')) {
              testSuite.tests.push({
                asserts: this.extractAsserts(methodDeclaration.node),
                endLine: methodDeclaration.node.span[2],
                events: this.extractEvents(methodDeclaration.node),
                isExclusive: false,
                isIgnored: methodDeclaration.decorators?.some(({ identifier }) => ['skip', 'unittest.skip'].includes(identifier)) || false,
                name: methodDeclaration.identifier,
                startLine: methodDeclaration.node.span[0],
                startColumn: methodDeclaration.node.span[1],
                endColumn: methodDeclaration.node.span[3],
                statements: this.getAllStatements.execute(methodDeclaration.node),
              });
            }
          });

          testSuites.push(testSuite);
        }
      }
    });

    return testSuites.filter(({ tests }) => tests.length > 0);
  }

  private extractEvents(node: ASTNodeModel): TestEventModel[] {
    const events: TestEventModel[] = [];
    const methodInvocations = this.findAllMethodInvocations.execute(node);

    methodInvocations.forEach(({ identifier, node }) => {
      let type = TestEventTypeModel.unknown;

      if (this.assertMethods.includes(identifier)) {
        type = TestEventTypeModel.assert;
      } else if (this.printMethods.includes(identifier)) {
        type = TestEventTypeModel.print;
      } else if (this.sleepMethods.includes(identifier)) {
        type = TestEventTypeModel.sleep;
      }

      events.push({
        endLine: node.span[2],
        name: identifier,
        startLine: node.span[0],
        type,
        startColumn: node.span[1],
        endColumn: node.span[3],
      });
    });

    return events;
  }

  private extractAsserts(node: ASTNodeModel): TestAssertModel[] {
    const methodInvocations = this.findAllMethodInvocations.execute(node);
    const assertMethodInvocations = methodInvocations.filter(({ identifier }) =>
      this.assertMethods.includes(identifier)
    );

    return assertMethodInvocations.map((methodInvocation) => this.extractAssertData(methodInvocation));
  }

  private extractAssertData(methodInvocation: FunctionOrMethodInvocationModel): TestAssertModel {
    const testAssert: TestAssertModel = {
      endLine: methodInvocation.node.span[2],
      matcher: methodInvocation.identifier,
      startLine: methodInvocation.node.span[0],
      startColumn: methodInvocation.node.span[1],
      endColumn: methodInvocation.node.span[3],
    };

    if (methodInvocation.parameterNodes?.length) {
      testAssert.literalActual = this.getLiteralValue.execute(methodInvocation.parameterNodes[0]);

      if (methodInvocation.parameterNodes.length > 1) {
        if ([
          'assertTrue',
          'assertFalse',
          'assertIsNone',
          'assertIsNotNone',
          'self.assertTrue',
          'self.assertFalse',
          'self.assertIsNone',
          'self.assertIsNotNone',
        ].includes(methodInvocation.identifier)) {
          testAssert.message = this.getLiteralValue.execute(methodInvocation.parameterNodes[1]);
        } else {
          testAssert.literalExpected = this.getLiteralValue.execute(methodInvocation.parameterNodes[1]);
        }
      }

      if (methodInvocation.parameterNodes.length > 2) {
        testAssert.message = this.getLiteralValue.execute(methodInvocation.parameterNodes[2]);
      }
    }

    return testAssert;
  }
}
