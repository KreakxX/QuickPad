export type message = {
  column: number;
  line: number;
  endColumn?: number;
  endLine?: number;
  text: string;
};