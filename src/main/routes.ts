import { Express } from 'express';
import { adaptRoute } from './adapters';
import { makeDetectFileTestSmellsController, makeDetectProjectTestSmellsController, makeRefactorFileTestSmellController } from './factories/controllers';

export function setupRoutes(express: Express): void {
  express.post('/file-test-smells/detect', adaptRoute(makeDetectFileTestSmellsController()));
  express.post('/file-test-smells/refactor', adaptRoute(makeRefactorFileTestSmellController()));
  express.post('/project-test-smells/detect', adaptRoute(makeDetectProjectTestSmellsController()));
}
