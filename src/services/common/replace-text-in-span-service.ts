import { ReplaceTextInSpan } from '../../domain/usecases';

export class ReplaceTextInSpanService implements ReplaceTextInSpan {
  execute(fullText: string, span: number[], newText: string): string {
    const lines = fullText.split('\n');
    const [startLine, startColumn, endLine, endColumn] = span;

    if (startLine > endLine || (startLine === endLine && startColumn > endColumn)) {
      throw new Error('Invalid range');
    }

    const startLineIdx = startLine - 1;
    const startColumnIdx = startColumn - 1;
    const endLineIdx = endLine - 1;
    const endColumnIdx = endColumn - 1;

    const beforeSpan = lines.slice(0, startLineIdx).join('\n') + (startLineIdx > 0 ? '\n' : '') + lines[startLineIdx].slice(0, startColumnIdx);
    const afterSpan = lines[endLineIdx].slice(endColumnIdx) + (endLineIdx < lines.length - 1 ? '\n' : '') + lines.slice(endLineIdx + 1).join('\n');

    return [beforeSpan, newText, afterSpan].join('');
  }
}
