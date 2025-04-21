import fs from 'fs';
import os from 'os';
import path from 'path';
import { v4 as uuid4 } from 'uuid';
import { TestModel, TestSmell } from '../../domain/models';
import { DetectTestSmell, ExtractTestsFromAST, GenerateAST } from '../../domain/usecases';
import { internalServer, ok, unprocessableEntity } from '../helpers';
import { Controller, HttpRequest, HttpResponse } from '../protocols';

export class DetectFileTestSmellsController implements Controller {
  constructor(
    private readonly extractTestsFromASTServices: Map<string, Map<string, ExtractTestsFromAST>>,
    private readonly generateASTService: GenerateAST,
    private readonly detectTestSmellServices: DetectTestSmell[],
    private readonly languageExtensionMap: Map<string, string>,
  ) { }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { language, framework, testFileContent }: { language: string, framework: string, testFileContent: string } = httpRequest.body;

    if (!language || !framework || !testFileContent) {
      return unprocessableEntity(new Error('language, framework and testFileContent are required.'));
    }

    const extractTestsFromASTService = this.extractTestsFromASTServices.get(language)?.get(framework);

    if (!extractTestsFromASTService) {
      return unprocessableEntity(new Error('language or framework is not supported.'));
    }

    try {
      const tempDir = os.tmpdir();
      const testFilePath = path.join(tempDir, uuid4(), `${uuid4()}${this.languageExtensionMap.get(language)}`);

      fs.mkdirSync(path.dirname(testFilePath), { recursive: true });
      fs.writeFileSync(testFilePath, testFileContent.trim());

      const testFileAST = await this.generateASTService.execute(testFilePath);
      const testSuites = extractTestsFromASTService.execute(testFileAST);
      const testSmellsPerTestSuite = await Promise.all(testSuites.map(async (testSuite) => {
        const testSmellsPerTest = await Promise.all(
          this.detectTestSmellServices.map(service => service.execute(testSuite))
        );
        const flattenedTestSmellsPerTest = testSmellsPerTest.flat();
        const groupedTestSmellsPerTest = flattenedTestSmellsPerTest.reduce((acc, item) => {
          const key = item.test.name;

          if (!acc[key]) {
            acc[key] = { test: item.test, testSmells: [] };
          }

          acc[key].testSmells.push(...item.testSmells);

          return acc;
        }, {} as Record<string, { test: TestModel; testSmells: TestSmell[] }>);

        return {
          testSuite,
          tests: Object.values(groupedTestSmellsPerTest),
        };
      }));

      return ok({
        testFileAST,
        testSuites: testSmellsPerTestSuite,
      });
    } catch (error) {
      return internalServer(new Error('An error occurred when trying to detect test smells. Please try again later.'));
    }
  }
}
