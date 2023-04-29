export class Loc {
  constructor(
    public filePath: string,
    public row: number,
    public col: number
  ) { }

  toString() {
    return `${this.filePath}:${this.row}:${this.col}`;
  }
}
