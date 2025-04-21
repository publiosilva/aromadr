import { ASTModel, TestModel, TestSmell } from '../../domain/models';
import { RefactorTestSmell } from '../../domain/usecases';
import { internalServer, ok, unprocessableEntity } from '../helpers';
import { Controller, HttpRequest, HttpResponse } from '../protocols';

export class RefactorFileTestSmellController implements Controller {
  constructor(
    private readonly refactorTestSmellServices: Map<string, RefactorTestSmell>
  ) { }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { testFileAST, test, testSmell }: { testFileAST: ASTModel, test: TestModel, testSmell: TestSmell } = httpRequest.body;

    if (!testFileAST || !test || !testSmell) {
      return unprocessableEntity(new Error('testFileAST, test and testSmell are required.'));
    }

    const refactorTestSmellService = this.refactorTestSmellServices.get(testSmell.name);

    if (!refactorTestSmellService) {
      return unprocessableEntity(new Error('test smell is not supported.'));
    }

    try {
      const refactoredTestFileContent = refactorTestSmellService.execute(
        testFileAST,
        test,
        testSmell,
      );

      return ok({
        testFileContent: refactoredTestFileContent,
      });
    } catch (error) {
      return internalServer(new Error('An error occurred when trying to refactor test smells. Please try again later.'));
    }
  }
}
