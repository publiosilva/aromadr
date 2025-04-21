import { RefactorTestSmell } from '../../domain/usecases';
import { RefactorTestSmellWithExtractMethodService } from './refactor-test-smell-with-extract-method';

export class RefactorDuplicateAssertTestSmellService extends RefactorTestSmellWithExtractMethodService implements RefactorTestSmell { }
