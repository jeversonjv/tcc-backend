import { Injectable } from '@nestjs/common';

@Injectable()
export class NQueensAlgorithmProvider {
  private numberOfQueens: number;
  private result: number[][][] = [];
  private board: number[][] = [];

  isValid(row: number, col: number): boolean {
    for (let i = 0; i < row; i++) {
      const prevCol = this.board[i].indexOf(1);
      if (prevCol === col) {
        return false;
      }
      const colDiff = Math.abs(prevCol - col);
      const rowDiff = Math.abs(i - row);
      if (colDiff === rowDiff) {
        return false;
      }
    }
    return true;
  }

  backtrack(row: number): void {
    if (row === this.numberOfQueens) {
      this.result.push(this.board.map((row) => [...row]));
      return;
    }

    for (let col = 0; col < this.numberOfQueens; col++) {
      if (this.isValid(row, col)) {
        this.board[row][col] = 1;
        this.backtrack(row + 1);
        this.board[row][col] = 0;
      }
    }
  }

  solve(n: number): number[][][] {
    for (let i = 0; i < n; i++) {
      this.board.push(new Array(n).fill(0));
    }

    this.backtrack(0);
    return this.result;
  }

  handle(numberOfQueens: number) {
    this.numberOfQueens = numberOfQueens;
    const start = performance.now();
    const result = this.solve(numberOfQueens) as any;
    const end = performance.now();

    this.result = [];
    this.board = [];

    return {
      result,
      totalTimeToProcess: Number(end - start),
    };
  }
}
