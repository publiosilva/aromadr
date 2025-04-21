import { ASTModel, ASTNodeModel, FunctionOrMethodInvocationModel, TestAssertModel, TestEventModel, TestEventTypeModel, TestSuiteModel } from '../../domain/models';
import { ExtractTestsFromAST, FindAllClassDeclarations, FindAllFunctionOrMethodDeclarations, FindAllFunctionOrMethodInvocations, GetAllStatements, GetLiteralValue } from '../../domain/usecases';

export class ExtractTestsFromJavaJUnitASTService implements ExtractTestsFromAST {
  private readonly assertMethods = [
    'assertArrayEquals',
    'assertEquals',
    'assertFalse',
    'assertNotNull',
    'assertNotSame',
    'assertNull',
    'assertSame',
    'assertThat',
    'assertTrue',
    'fail',
    'Assert.assertArrayEquals',
    'Assert.assertEquals',
    'Assert.assertFalse',
    'Assert.assertNotNull',
    'Assert.assertNotSame',
    'Assert.assertNull',
    'Assert.assertSame',
    'Assert.assertThat',
    'Assert.assertTrue',
    'Assert.fail',
    'Assertions.assertArrayEquals',
    'Assertions.assertEquals',
    'Assertions.assertFalse',
    'Assertions.assertNotNull',
    'Assertions.assertNotSame',
    'Assertions.assertNull',
    'Assertions.assertSame',
    'Assertions.assertThat',
    'Assertions.assertTrue',
    'Assertions.fail',
  ];

  private readonly printMethods = [
    'System.out.println',
    'println',
  ];

  private readonly sleepMethods = [
    'Thread.sleep',
  ];

  private readonly disableAnnotations = [
    'Ignore',
    'Disabled',
    'EnabledOnOs',
    'DisabledOnOs',
    'EnabledOnJre',
    'EnabledForJreRange',
    'DisabledOnJre',
    'DisabledForJreRange',
    'EnabledInNativeImage',
    'DisabledInNativeImage',
    'EnabledIfSystemProperty',
    'DisabledIfSystemProperty',
    'EnabledIfEnvironmentVariable',
    'DisabledIfEnvironmentVariable',
    'EnabledIf',
    'DisabledIf',
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
      const methodDeclarations = this.findAllMethodDeclarations.execute(classDeclaration.node);
      const hasTestMethods = methodDeclarations.some(
        ({ decorators, identifier }) => decorators?.some(({ identifier }) => identifier === 'Test')
          || (classDeclaration.superclasses?.includes('TestCase') && identifier.startsWith('test'))
      );

      if (hasTestMethods) {
        const testSuite: TestSuiteModel = {
          isExclusive: false,
          isIgnored: classDeclaration.decorators?.some(({ identifier }) => this.disableAnnotations.includes(identifier)) || false,
          name: classDeclaration.identifier,
          tests: [],
        };

        methodDeclarations.forEach((methodDeclaration) => {
          const isTestMethod = methodDeclaration?.decorators?.some(({ identifier }) => identifier === 'Test') || methodDeclaration.identifier.startsWith('test');

          if (isTestMethod) {
            testSuite.tests.push({
              asserts: this.extractAsserts(methodDeclaration.node),
              endLine: methodDeclaration.node.span[2],
              events: this.extractEvents(methodDeclaration.node),
              isExclusive: false,
              isIgnored: methodDeclaration.decorators?.some(({ identifier }) => this.disableAnnotations.includes(identifier)) || false,
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
    const assertMethodInvocations = methodInvocations.filter(({ identifier }) => this.assertMethods.includes(identifier));

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

    if (
      [
        'assertArrayEquals',
        'assertEquals',
        'assertNotSame',
        'assertSame',
        'assertThat',
        'Assert.assertArrayEquals',
        'Assert.assertEquals',
        'Assert.assertNotSame',
        'Assert.assertSame',
        'Assert.assertThat',
        'Assertions.assertArrayEquals',
        'Assertions.assertEquals',
        'Assertions.assertNotSame',
        'Assertions.assertSame',
        'Assertions.assertThat',
      ].includes(methodInvocation.identifier)
    ) {
      if (methodInvocation.parameterNodes?.length) {
        if (methodInvocation.parameterNodes.length === 2) {
          testAssert.literalActual = this.getLiteralValue.execute(methodInvocation.parameterNodes[1]);
          testAssert.literalExpected = this.getLiteralValue.execute(methodInvocation.parameterNodes[0]);
        } else if (methodInvocation.parameterNodes.length > 2) {
          testAssert.literalActual = this.getLiteralValue.execute(methodInvocation.parameterNodes[2]);
          testAssert.literalExpected = this.getLiteralValue.execute(methodInvocation.parameterNodes[1]);
          testAssert.message = this.getLiteralValue.execute(methodInvocation.parameterNodes[0]);
        }
      }
    } else if (
      [
        'assertFalse',
        'assertNotNull',
        'assertNull',
        'assertTrue',
        'Assert.assertFalse',
        'Assert.assertNotNull',
        'Assert.assertNull',
        'Assert.assertTrue',
        'Assertions.assertFalse',
        'Assertions.assertNotNull',
        'Assertions.assertNull',
        'Assertions.assertTrue',
      ].includes(methodInvocation.identifier)
    ) {
      if (methodInvocation.parameterNodes?.length === 1) {
        testAssert.literalActual = this.getLiteralValue.execute(methodInvocation.parameterNodes[0]);
      } else if (methodInvocation.parameterNodes?.length === 2) {
        testAssert.literalActual = this.getLiteralValue.execute(methodInvocation.parameterNodes[1]);
        testAssert.message = this.getLiteralValue.execute(methodInvocation.parameterNodes[0]);
      }
    }

    if ([
      'fail',
      'Assert.fail',
      'Assertions.fail',
    ].includes(methodInvocation.identifier)) {
      if (methodInvocation.parameterNodes?.length === 1) {
        testAssert.message = this.getLiteralValue.execute(methodInvocation.parameterNodes[0]);
      }
    }

    return testAssert;
  }
}
