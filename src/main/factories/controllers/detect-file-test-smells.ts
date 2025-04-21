import { ExtractTestsFromAST } from '../../../domain/usecases';
import { DetectFileTestSmellsController } from '../../../presentation/controllers';
import { Controller } from '../../../presentation/protocols';
import { makeDetectAssertionRouletteTestSmellService, makeDetectConditionalTestTestSmellService, makeDetectDuplicateAssertTestSmellService, makeDetectEmptyTestTestSmellService, makeDetectExceptionHandlingTestSmellService, makeDetectIgnoredTestTestSmellService, makeDetectMagicNumberTestTestSmellService, makeDetectSleepyTestTestSmellService, makeDetectUnknownTestTestSmellService, makeExtractTestsFromCSharpXUnitASTService, makeExtractTestsFromJavaJUnitASTService, makeExtractTestsFromJavaScriptJestASTService, makeExtractTestsFromPythonPyTestASTService, makeExtractTestsFromPythonUnittestASTService, makeGenerateASTService } from '../services';

export const makeDetectFileTestSmellsController = (): Controller => {
  const extractTestsFromASTServices = new Map([
    ['csharp', new Map<string, ExtractTestsFromAST>([['xunit', makeExtractTestsFromCSharpXUnitASTService()]])],
    ['java', new Map<string, ExtractTestsFromAST>([['junit', makeExtractTestsFromJavaJUnitASTService()]])],
    ['python', new Map<string, ExtractTestsFromAST>([['unittest', makeExtractTestsFromPythonUnittestASTService()]])],
    ['python', new Map<string, ExtractTestsFromAST>([['pytest', makeExtractTestsFromPythonPyTestASTService()]])],
    ['javascript', new Map<string, ExtractTestsFromAST>([['jest', makeExtractTestsFromJavaScriptJestASTService()]])],
  ]);
  const generateASTService = makeGenerateASTService();
  const detectTestSmellServices = [
    makeDetectAssertionRouletteTestSmellService(),
    makeDetectConditionalTestTestSmellService(),
    makeDetectDuplicateAssertTestSmellService(),
    makeDetectEmptyTestTestSmellService(),
    makeDetectIgnoredTestTestSmellService(),
    makeDetectMagicNumberTestTestSmellService(),
    makeDetectSleepyTestTestSmellService(),
    makeDetectUnknownTestTestSmellService(),
    makeDetectExceptionHandlingTestSmellService(),
  ];
  const languageExtensionMap = new Map([
    ['csharp', '.cs'],
    ['java', '.java'],
    ['python', '.py'],
    ['javascript', '.js'],
  ]);
  const controller = new DetectFileTestSmellsController(
    extractTestsFromASTServices,
    generateASTService,
    detectTestSmellServices,
    languageExtensionMap,
  );

  return controller;
};
