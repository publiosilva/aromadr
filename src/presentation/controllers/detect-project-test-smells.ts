import fs from 'fs';
import { TestModel, TestSmell } from '../../domain/models';
import { DetectTestFiles, DetectTestSmell, DownloadRepository, ExtractTestsFromAST, GenerateAST } from '../../domain/usecases';
import { internalServer, ok, unprocessableEntity } from '../helpers';
import { Controller, HttpRequest, HttpResponse } from '../protocols';

export class DetectProjectTestSmellsController implements Controller {
  constructor(
    private readonly detectTestFilesServices: Map<string, Map<string, DetectTestFiles>>,
    private readonly extractTestsFromASTServices: Map<string, Map<string, ExtractTestsFromAST>>,
    private readonly downloadRepositoryService: DownloadRepository,
    private readonly generateASTService: GenerateAST,
    private readonly detectTestSmellServices: DetectTestSmell[],
  ) { }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { language, framework, repositoryURL }: { language: string, framework: string, repositoryURL: string } = httpRequest.body;

    if (!language || !framework || !repositoryURL) {
      return unprocessableEntity(new Error('language, framework and repositoryURL are required.'));
    }

    const detectTestFilesService = this.detectTestFilesServices.get(language)?.get(framework);
    const extractTestsFromASTService = this.extractTestsFromASTServices.get(language)?.get(framework);

    if (!detectTestFilesService || !extractTestsFromASTService) {
      return unprocessableEntity(new Error('language or framework is not supported.'));
    }

    try {
      const projectFolder = await this.downloadRepositoryService.execute(repositoryURL);
      const testFilePaths = await detectTestFilesService.execute(projectFolder);
      const response = await Promise.all(testFilePaths.map(async (testFilePath) => {
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

        return {
          testFileContent: fs.readFileSync(testFilePath).toString(),
          testFileAST,
          testFilePath: testFilePath.replace(`${projectFolder}/`, ''),
          testSuites: testSmellsPerTestSuite,
        };
      }));

      return ok(response);
    } catch (error) {
      return internalServer(new Error('An error occurred when trying to detect test smells. Please try again later.'));
    }
  }
}
