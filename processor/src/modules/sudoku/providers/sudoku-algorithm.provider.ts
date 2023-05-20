import { Injectable } from '@nestjs/common';

@Injectable()
export class SudokuAlgorithmProvider {
  private board;
  private size;
  private boxSize;

  findEmpty(): [number, number] | null {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.board[i][j] === 0) {
          return [i, j];
        }
      }
    }
    return null;
  }

  isValid(num: number, row: number, col: number): boolean {
    for (let i = 0; i < this.size; i++) {
      // Check row
      if (this.board[row][i] === num) {
        return false;
      }
      // Check column
      if (this.board[i][col] === num) {
        return false;
      }
      // Check box
      const boxRow =
        Math.floor(row / this.boxSize) * this.boxSize +
        Math.floor(i / this.boxSize);
      const boxCol =
        Math.floor(col / this.boxSize) * this.boxSize + (i % this.boxSize);
      if (this.board[boxRow][boxCol] === num) {
        return false;
      }
    }
    return true;
  }

  solve(): boolean {
    const emptyCell = this.findEmpty();
    if (!emptyCell) {
      return true;
    }
    const [row, col] = emptyCell;
    for (let num = 1; num <= this.size; num++) {
      if (this.isValid(num, row, col)) {
        this.board[row][col] = num;
        if (this.solve()) {
          return true;
        }
        this.board[row][col] = 0;
      }
    }
    return false;
  }

  handle(input: number[][]) {
    this.board = input;
    this.size = this.board.length;
    this.boxSize = Math.sqrt(this.size);
    let result = {};

    const start = performance.now();

    const solvedSudoku = this.solve();
    if (solvedSudoku) {
      result = this.board;
    }

    const end = performance.now();

    return {
      result,
      totalTimeToProcess: Number(end - start),
    };
  }
}
