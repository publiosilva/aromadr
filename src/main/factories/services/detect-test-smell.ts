import { DetectTestSmell } from '../../../domain/usecases';
import { DetectAssertionRouletteTestSmellService, DetectConditionalTestTestSmellService, DetectDuplicateAssertTestSmellService, DetectEmptyTestTestSmellService, DetectExceptionHandlingTestSmellService, DetectIgnoredTestTestSmellService, DetectMagicNumberTestTestSmellService, DetectRedundantAssertionTestSmellService, DetectRedundantPrintTestSmellService, DetectSleepyTestTestSmellService, DetectUnknownTestTestSmellService } from '../../../services';

export function makeDetectAssertionRouletteTestSmellService(): DetectTestSmell {
  return new DetectAssertionRouletteTestSmellService();
}

export function makeDetectDuplicateAssertTestSmellService(): DetectTestSmell {
  return new DetectDuplicateAssertTestSmellService();
}

export function makeDetectIgnoredTestTestSmellService(): DetectTestSmell {
  return new DetectIgnoredTestTestSmellService();
}

export function makeDetectMagicNumberTestTestSmellService(): DetectTestSmell {
  return new DetectMagicNumberTestTestSmellService();
}

export function makeDetectSleepyTestTestSmellService(): DetectTestSmell {
  return new DetectSleepyTestTestSmellService();
}

export function makeDetectUnknownTestTestSmellService(): DetectTestSmell {
  return new DetectUnknownTestTestSmellService();
}

export function makeDetectConditionalTestTestSmellService(): DetectTestSmell {
  return new DetectConditionalTestTestSmellService();
}

export function makeDetectEmptyTestTestSmellService(): DetectTestSmell {
  return new DetectEmptyTestTestSmellService();
}

export function makeDetectExceptionHandlingTestSmellService(): DetectTestSmell {
  return new DetectExceptionHandlingTestSmellService();
}

export function makeDetectRedundantPrintTestSmellService(): DetectTestSmell {
  return new DetectRedundantPrintTestSmellService();
}

export function makeDetectRedundantAssertionTestSmellService(): DetectTestSmell {
  return new DetectRedundantAssertionTestSmellService();
}
