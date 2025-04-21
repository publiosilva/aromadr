import { ExtractTestsFromAST } from '../../../domain/usecases';
import { ExtractTestsFromCSharpXUnitASTService, ExtractTestsFromJavaJUnitASTService, ExtractTestsFromJavaScriptJestASTService, ExtractTestsFromPythonPyTestASTService, ExtractTestsFromPythonUnittestASTService, FindAllClassDeclarationsService, FindAllFunctionOrMethodDeclarationsService, FindAllFunctionOrMethodInvocationsService, GetAllStatementsService, GetLiteralValueService, IsAInsideOfBService } from '../../../services';

export function makeExtractTestsFromCSharpXUnitASTService(): ExtractTestsFromAST {
  return new ExtractTestsFromCSharpXUnitASTService(
    new FindAllClassDeclarationsService(
      new GetLiteralValueService()
    ),
    new FindAllFunctionOrMethodDeclarationsService(
      new GetLiteralValueService()
    ),
    new FindAllFunctionOrMethodInvocationsService(
      new GetLiteralValueService()
    ),
    new GetLiteralValueService(),
    new GetAllStatementsService(),
  );
}

export function makeExtractTestsFromJavaJUnitASTService(): ExtractTestsFromAST {
  return new ExtractTestsFromJavaJUnitASTService(
    new FindAllClassDeclarationsService(
      new GetLiteralValueService()
    ),
    new FindAllFunctionOrMethodDeclarationsService(
      new GetLiteralValueService()
    ),
    new FindAllFunctionOrMethodInvocationsService(
      new GetLiteralValueService()
    ),
    new GetLiteralValueService(),
    new GetAllStatementsService(),
  );
}

export function makeExtractTestsFromPythonPyTestASTService(): ExtractTestsFromAST {
  return new ExtractTestsFromPythonPyTestASTService(
    new FindAllClassDeclarationsService(
      new GetLiteralValueService()
    ),
    new FindAllFunctionOrMethodDeclarationsService(
      new GetLiteralValueService()
    ),
    new FindAllFunctionOrMethodInvocationsService(
      new GetLiteralValueService()
    ),
    new GetLiteralValueService(),
    new IsAInsideOfBService(),
    new GetAllStatementsService(),
  );
}

export function makeExtractTestsFromPythonUnittestASTService(): ExtractTestsFromAST {
  return new ExtractTestsFromPythonUnittestASTService(
    new FindAllClassDeclarationsService(
      new GetLiteralValueService()
    ),
    new FindAllFunctionOrMethodDeclarationsService(
      new GetLiteralValueService()
    ),
    new FindAllFunctionOrMethodInvocationsService(
      new GetLiteralValueService()
    ),
    new GetLiteralValueService(),
    new GetAllStatementsService(),
  );
}

export function makeExtractTestsFromJavaScriptJestASTService(): ExtractTestsFromAST {
  return new ExtractTestsFromJavaScriptJestASTService(
    new FindAllFunctionOrMethodInvocationsService(
      new GetLiteralValueService()
    ),
    new GetLiteralValueService(),
    new GetAllStatementsService(),
  );
}
