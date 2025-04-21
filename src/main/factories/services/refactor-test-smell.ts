import { RefactorTestSmell } from '../../../domain/usecases';
import { DeleteChildBySpanService, FindChildBySpanService, GetLiteralValueService, ReplaceTextInSpanService } from '../../../services';
import { RefactorAssertionRouletteTestSmellService, RefactorDuplicateAssertTestSmellService } from '../../../services/refactor-test-smell';

export function makeRefactorAssertionRouletteTestSmellService(): RefactorTestSmell {
  return new RefactorAssertionRouletteTestSmellService(
    new FindChildBySpanService(),
    new DeleteChildBySpanService(),
    new GetLiteralValueService(),
    new ReplaceTextInSpanService()
  );
}

export function makeRefactorDuplicateAssertTestSmellService(): RefactorTestSmell {
  return new RefactorDuplicateAssertTestSmellService(
    new FindChildBySpanService(),
    new DeleteChildBySpanService(),
    new GetLiteralValueService(),
    new ReplaceTextInSpanService()
  );
}
