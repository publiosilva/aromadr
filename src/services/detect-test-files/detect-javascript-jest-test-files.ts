import fs from 'fs';
import path from 'path';
import { DetectTestFiles } from '../../domain/usecases';

export class DetectJavaScriptJestTestFilesService implements DetectTestFiles {
  async execute(projectFolder: string): Promise<string[]> {
    const testFiles: string[] = [];

    async function traverseDirectory(currentPath: string): Promise<void> {
      const entries = await fs.promises.readdir(currentPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(currentPath, entry.name);

        if (entry.isDirectory()) {
          await traverseDirectory(fullPath);
        } else if (entry.isFile() && (entry.name.endsWith('.js') || entry.name.endsWith('.ts'))) {
          const fileContent = await fs.promises.readFile(fullPath, 'utf-8');
          const testPatterns = [
            'it(',
            'test(',
            'xit(',
            'xtest(',
            'it.only(',
            'test.only(',
            'it.skip(',
            'test.skip(',
          ];

          if (testPatterns.some(pattern => fileContent.includes(pattern))) {
            testFiles.push(fullPath);
          }
        }
      }
    }

    await traverseDirectory(projectFolder);

    return testFiles;
  }
}
