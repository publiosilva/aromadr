export interface TestSuiteModel {
  filePath?: string;
  isExclusive: boolean; // only this test suite
  isIgnored: boolean; // this test suite is skipped
  name: string;
  tests: TestModel[];
}

export interface TestModel {
  asserts: TestAssertModel[];
  endLine: number;
  events: TestEventModel[];
  isExclusive: boolean; // only this test runs
  isIgnored: boolean; // this test is skipped
  name: string;
  startLine: number;
  startColumn: number;
  statements: TestStatementModel[];
  endColumn: number;
}

export enum TestStatementTypeModel {
  assignment = 'assignment',
  call = 'call',
  condition = 'condition',
  exceptionHandling = 'exceptionHandling',
  exceptionThrowing = 'exceptionThrowing',
  loop = 'loop',
  other = 'other',
}

export interface TestStatementModel {
  type: TestStatementTypeModel;
  startLine: number;
  endLine: number;
  startColumn: number;
  endColumn: number;
}

export enum TestEventTypeModel {
  assert = 'assert',
  print = 'print',
  sleep = 'sleep',
  unknown = 'unknown',
}

export interface TestEventModel {
  endLine: number;
  name: string;
  startLine: number;
  type: TestEventTypeModel;
  startColumn: number;
  endColumn: number;
}

export interface TestAssertModel {
  literalActual?: string;
  matcher: string;
  literalExpected?: string;
  message?: string;
  startLine: number;
  endLine: number;
  startColumn: number;
  endColumn: number;
}
