import { DetectTestFiles } from '../../../domain/usecases';
import { DetectCSharpXUnitTestFilesService, DetectJavaJUnitTestFilesService, DetectJavaScriptJestTestFilesService, DetectPythonPyTestTestFilesService, DetectPythonUnittestTestFilesService } from '../../../services';

export function makeDetectCSharpXUnitTestFilesService(): DetectTestFiles {
  return new DetectCSharpXUnitTestFilesService();
}

export function makeDetectJavaJUnitTestFilesService(): DetectTestFiles {
  return new DetectJavaJUnitTestFilesService();
}

export function makeDetectPythonPyTestTestFilesService(): DetectTestFiles {
  return new DetectPythonPyTestTestFilesService();
}

export function makeDetectPythonUnittestTestFilesService(): DetectTestFiles {
  return new DetectPythonUnittestTestFilesService();
}

export function makeDetectJavaScriptJestTestFilesService(): DetectTestFiles {
  return new DetectJavaScriptJestTestFilesService();
}
