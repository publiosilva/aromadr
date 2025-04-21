import { TestModel, TestSmell, TestSuiteModel } from '../models';

export interface DetectTestSmell {
  execute(testSuite: TestSuiteModel): { test: TestModel, testSmells: TestSmell[] }[];
}
