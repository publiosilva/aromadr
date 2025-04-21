import { ExtractTestsFromAST } from '../../../domain/usecases';
import { DetectProjectTestSmellsController } from '../../../presentation/controllers';
import { Controller } from '../../../presentation/protocols';
import { makeDetectAssertionRouletteTestSmellService, makeDetectConditionalTestTestSmellService, makeDetectCSharpXUnitTestFilesService, makeDetectDuplicateAssertTestSmellService, makeDetectEmptyTestTestSmellService, makeDetectExceptionHandlingTestSmellService, makeDetectIgnoredTestTestSmellService, makeDetectJavaJUnitTestFilesService, makeDetectJavaScriptJestTestFilesService, makeDetectMagicNumberTestTestSmellService, makeDetectPythonPyTestTestFilesService, makeDetectPythonUnittestTestFilesService, makeDetectSleepyTestTestSmellService, makeDetectUnknownTestTestSmellService, makeDownloadGithubRepositoryService, makeExtractTestsFromCSharpXUnitASTService, makeExtractTestsFromJavaJUnitASTService, makeExtractTestsFromJavaScriptJestASTService, makeExtractTestsFromPythonPyTestASTService, makeExtractTestsFromPythonUnittestASTService, makeGenerateASTService } from '../services';

export const makeDetectProjectTestSmellsController = (): Controller => {
  const detectTestFilesServices = new Map([
    ['csharp', new Map([['xunit', makeDetectCSharpXUnitTestFilesService()]])],
    ['java', new Map([['junit', makeDetectJavaJUnitTestFilesService()]])],
    ['python', new Map([['unittest', makeDetectPythonUnittestTestFilesService()]])],
    ['python', new Map([['pytest', makeDetectPythonPyTestTestFilesService()]])],
    ['javascript', new Map([['jest', makeDetectJavaScriptJestTestFilesService()]])],
  ]);
  const extractTestsFromASTServices = new Map([
    ['csharp', new Map<string, ExtractTestsFromAST>([['xunit', makeExtractTestsFromCSharpXUnitASTService()]])],
    ['java', new Map<string, ExtractTestsFromAST>([['junit', makeExtractTestsFromJavaJUnitASTService()]])],
    ['python', new Map<string, ExtractTestsFromAST>([['unittest', makeExtractTestsFromPythonUnittestASTService()]])],
    ['python', new Map<string, ExtractTestsFromAST>([['pytest', makeExtractTestsFromPythonPyTestASTService()]])],
    ['javascript', new Map<string, ExtractTestsFromAST>([['jest', makeExtractTestsFromJavaScriptJestASTService()]])],
  ]);
  const downloadRepositoryService = makeDownloadGithubRepositoryService();
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
  const controller = new DetectProjectTestSmellsController(
    detectTestFilesServices,
    extractTestsFromASTServices,
    downloadRepositoryService,
    generateASTService,
    detectTestSmellServices,
  );

  return controller;
};
