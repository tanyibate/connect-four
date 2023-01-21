import type { NextApiRequest, NextApiResponse } from "next";
import { checkWinningMove } from "../../utils/game";

const PLAYER_PIECE = 1;
const AI_PIECE = 2;
const WINDOW_SIZE = 4;

const insertCounterIntoColumn = (
  board: number[][],
  column: number,
  player: number
) => {
  const numOfRows = board.length;
  const copyOfBoard = board.map(function (arr) {
    return arr.slice();
  }); // deep copy of board
  for (let i = numOfRows - 1; i >= 0; i--) {
    if (copyOfBoard[i][column] === 0) {
      copyOfBoard[i][column] = player;
      return copyOfBoard;
    }
  }
};

const evaluateWindow = (window: number[], piece: number): number => {
  let score = 0;
  let pieceCount = 0;
  let emptyCount = 0;
  let opponentCount = 0;
  window.forEach((windowPiece: number) => {
    if (windowPiece === piece) {
      pieceCount++;
    } else if (windowPiece === 0) {
      emptyCount++;
    } else {
      opponentCount++;
    }

    if (pieceCount === 4) {
      score += 100;
    } else if (pieceCount === 3 && emptyCount === 1) {
      score += 5;
    } else if (pieceCount === 2 && emptyCount === 2) {
      score += 2;
    }

    if (opponentCount === 3 && emptyCount === 1) {
      score -= 4;
    }
  });
  return score;
};

const scorePosition = (board: number[][], piece: number) => {
  const numOfRows = board.length;
  const numOfColumns = board[0].length;
  let score = 0;

  const centerCount = board.reduce((acc, row) => {
    if (row[3] === piece) {
      return acc + 1;
    }
  }, 0);

  score += centerCount * 3;

  /* score horizontal */
  for (let i = 0; i < numOfRows; i++) {
    for (let j = 0; j < numOfColumns - 3; j++) {
      let row = board[i].slice(j, j + WINDOW_SIZE); // gets the next 4 pieces in the row

      score += evaluateWindow(row, piece);
    }
  }
  /* score vertical */
  for (let i = 0; i < numOfColumns; i++) {
    for (let j = 0; j < numOfRows - 3; j++) {
      let column = [
        board[j][i],
        board[j + 1][i],
        board[j + 2][i],
        board[j + 3][i],
      ];
      score += evaluateWindow(column, piece);
    }
  }

  /* score positive sloped diagonal */
  for (let i = 0; i < numOfRows - 3; i++) {
    for (let j = 0; j < numOfColumns - 3; j++) {
      let diagonal = [
        board[i][j],
        board[i + 1][j + 1],
        board[i + 2][j + 2],
        board[i + 3][j + 3],
      ];
      score += evaluateWindow(diagonal, piece);
    }
  }

  /* score negative sloped diagonal */
  for (let i = 3; i < numOfRows; i++) {
    for (let j = 0; j < numOfColumns - 3; j++) {
      let diagonal = [
        board[i][j],
        board[i - 1][j + 1],
        board[i - 2][j + 2],
        board[i - 3][j + 3],
      ];
      score += evaluateWindow(diagonal, piece);
    }
  }

  return score;
};

const getValidLocations = (board: number[][]): number[] => {
  let validLocations: number[] = [];
  board[0].forEach((cell, index) => {
    if (cell === 0) {
      validLocations.push(index);
    }
  });
  return validLocations;
};

const isTerminalNode = (board: number[][]): boolean => {
  return (
    getValidLocations(board).length === 0 ||
    (checkWinningMove(board, AI_PIECE) as boolean) ||
    (checkWinningMove(board, PLAYER_PIECE) as boolean)
  );
};

const miniMax = (
  board: number[][],
  depth: number,
  maximizingPlayer: boolean,
  piece: number,
  opponentPiece: number
) => {
  const validLocations = getValidLocations(board);
  const isTerminal = isTerminalNode(board);
  if (depth === 0 || isTerminal) {
    if (isTerminal) {
      if (checkWinningMove(board, piece) as boolean) {
        return { score: 100000000000000, column: null };
      } else if (checkWinningMove(board, opponentPiece)) {
        return { score: -100000000000, column: null };
      } else {
        return { score: 0, column: null }; // game over but no winner
      }
    } else {
      return { score: scorePosition(board, piece), column: null };
    }
  }
  if (maximizingPlayer) {
    // maximizing player
    let value = -Infinity;
    let column = Math.floor(Math.random() * validLocations.length);
    validLocations.forEach((col) => {
      let copyOfBoard = board.map(function (arr) {
        return arr.slice();
      });
      const boardWithMove = insertCounterIntoColumn(
        copyOfBoard,
        col,
        piece
      ) as number[][];
      let newScore = miniMax(
        boardWithMove,
        depth - 1,
        false,
        piece,
        opponentPiece
      ).score;

      if (newScore > value) {
        value = newScore;
        column = col;
      }
    });
    return { score: value, column };
  } else {
    // minimizing player
    let value = Infinity;
    let column = Math.floor(Math.random() * validLocations.length);
    validLocations.forEach((col) => {
      let copyOfBoard = board.map(function (arr) {
        return arr.slice();
      });
      const boardWithMove = insertCounterIntoColumn(
        copyOfBoard,
        col,
        opponentPiece
      ) as number[][];
      let newScore = miniMax(
        boardWithMove,
        depth - 1,
        true,
        piece,
        opponentPiece
      ).score;
      if (newScore < value) {
        value = newScore;
        column = col;
      }
    });
    return { score: value, column };
  }
};

const pickBestMove = (board: number[][], piece: number) => {
  const validLocations = getValidLocations(board);
  let bestScore = -10000;
  let bestColumn =
    validLocations[Math.floor(Math.random() * validLocations.length)];
  validLocations.forEach((column) => {
    let score;
    const boardWithMove = insertCounterIntoColumn(board, column, piece);
    score = scorePosition(boardWithMove as number[][], piece);
    if (column === 4) score += 6; // center column is the best
    if (score > bestScore) {
      bestScore = score;
      bestColumn = column;
    }
  });
  return bestColumn;
};

type Data = {
  bestMove: number;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const board = req.body.board;
  const player = req.body.player;

  res
    .status(200)
    .json({ bestMove: miniMax(board, 5, true, player, 3 - player).column });
}
