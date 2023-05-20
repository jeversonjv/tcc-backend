import { Injectable } from '@nestjs/common';
import * as PriorityQueue from 'priorityqueuejs';

interface Node {
  row: number;
  col: number;
  distance: number;
  previous: Node | null;
}

@Injectable()
export class MazeResolverAlgorithmProvider {
  handle(input: number[][]) {
    const start = performance.now();

    const matrix = input;

    const startRow = 0;
    const startCol = 0;
    const endRow = matrix.length - 1;
    const endCol = matrix.length - 1;

    const result = this.solveMaze(
      matrix,
      startRow,
      startCol,
      endRow,
      endCol,
    ).map((n) => ({
      row: n.row,
      col: n.col,
    })) as unknown as JSON;

    const end = performance.now();

    return {
      result,
      totalTimeToProcess: Number(end - start),
    };
  }

  solveMaze(
    matrix: number[][],
    startRow: number,
    startCol: number,
    endRow: number,
    endCol: number,
  ): Node[] | null {
    // Define an array to keep track of the nodes in the maze
    const nodes: Node[][] = [];

    // Generate rows for the nodes array
    for (let i = 0; i < matrix.length; i++) {
      nodes.push([]);

      // Generate columns for the nodes array
      for (let j = 0; j < matrix[0].length; j++) {
        nodes[i].push({
          row: i,
          col: j,
          distance: Infinity,
          previous: null,
        });
      }
    }

    // Set the distance of the starting node to 0
    const startNode = nodes[startRow][startCol];
    startNode.distance = 0;

    // Define a priority queue to store the nodes to be visited
    const queue = new PriorityQueue<Node>((a, b) => a.distance - b.distance);
    queue.enq(startNode);

    // Define a function to get the neighbors of a node
    function getNeighbors(node: Node): Node[] {
      const neighbors: Node[] = [];

      const directions = [
        { row: -1, col: 0 }, // Up
        { row: 1, col: 0 }, // Down
        { row: 0, col: -1 }, // Left
        { row: 0, col: 1 }, // Right
      ];

      for (let i = 0; i < directions.length; i++) {
        const nextRow = node.row + directions[i].row;
        const nextCol = node.col + directions[i].col;

        // Check if the next cell is valid
        if (
          nextRow >= 0 &&
          nextRow < matrix.length &&
          nextCol >= 0 &&
          nextCol < matrix[0].length &&
          matrix[nextRow][nextCol] === 0
        ) {
          const neighbor = nodes[nextRow][nextCol];
          neighbors.push(neighbor);
        }
      }

      return neighbors;
    }

    // Perform Dijkstra's algorithm
    while (!queue.isEmpty()) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const current = queue.deq()!;

      // Check if we've reached the end of the maze
      if (current.row === endRow && current.col === endCol) {
        // Build the path from the end node to the start node
        const path: Node[] = [];
        let node: Node | null = current;
        while (node !== null) {
          path.unshift(node);
          node = node.previous;
        }
        return path;
      }

      // Get the neighbors of the current node
      const neighbors = getNeighbors(current);

      // Update the distance of each neighbor if it is less than its current distance
      for (const neighbor of neighbors) {
        const distance = current.distance + 1;
        if (distance < neighbor.distance) {
          neighbor.distance = distance;
          neighbor.previous = current;
          queue.enq(neighbor);
        }
      }
    }

    // If we've explored all possible paths and haven't found the end, return null
    return null;
  }
}
