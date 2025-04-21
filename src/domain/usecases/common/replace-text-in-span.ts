export interface ReplaceTextInSpan {
  execute(fullText: string, span: number[], newText: string): string;
}
