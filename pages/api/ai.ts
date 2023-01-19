import type { NextApiRequest, NextApiResponse } from "next";

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
  return null;
};

const scorePosition = (board: number[][], piece: number) => {
  const numOfRows = board.length;
  const numOfColumns = board[0].length;
  let score = 0;
  const randomConnect4Column = Math.floor(Math.random() * 7);

  /* score horizontal */
  for (let i = 0; i < numOfRows; i++) {
    for (let j = 0; j < numOfColumns - 3; j++) {
      let row = board[i].slice(j, j + WINDOW_SIZE); // gets the next 4 pieces in the row

      let pieceCount = 0;
      let emptyCount = 0;
      let opponentCount = 0;
      row.forEach((rowPiece) => {
        if (rowPiece === piece) {
          pieceCount++;
        } else if (rowPiece === 0) {
          emptyCount++;
        } else {
          opponentCount++;
        }
      });

      if (pieceCount === 4) {
        score += 100;
      } else if (pieceCount === 3 && emptyCount === 1) {
        score += 10;
      } else if (pieceCount === 2 && emptyCount === 2) {
        score += 0;
      }
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
      let pieceCount = 0;
      let emptyCount = 0;
      let opponentCount = 0;
      column.forEach((columnPiece) => {
        if (columnPiece === piece) {
          pieceCount++;
        } else if (columnPiece === 0) {
          emptyCount++;
        } else {
          opponentCount++;
        }
      });
      if (pieceCount === 4) {
        score += 100;
      } else if (pieceCount === 3 && emptyCount === 1) {
        score += 10;
      } else if (pieceCount === 2 && emptyCount === 2) {
        score += 0;
      }
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
      let pieceCount = 0;
      let emptyCount = 0;
      let opponentCount = 0;
      diagonal.forEach((diagonalPiece) => {
        if (diagonalPiece === piece) {
          pieceCount++;
        } else if (diagonalPiece === 0) {
          emptyCount++;
        } else {
          opponentCount++;
        }
      });
      if (pieceCount === 4) {
        score += 100;
      } else if (pieceCount === 3 && emptyCount === 1) {
        score += 10;
      } else if (pieceCount === 2 && emptyCount === 2) {
        score += 0;
      }
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
      let pieceCount = 0;
      let emptyCount = 0;
      let opponentCount = 0;
      diagonal.forEach((diagonalPiece) => {
        if (diagonalPiece === piece) {
          pieceCount++;
        } else if (diagonalPiece === 0) {
          emptyCount++;
        } else {
          opponentCount++;
        }
      });
      if (pieceCount === 4) {
        score += 100;
      } else if (pieceCount === 3 && emptyCount === 1) {
        score += 10;
      } else if (pieceCount === 2 && emptyCount === 2) {
        score += 0;
      }
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

const pickBestMove = (board: number[][], piece: number) => {
  const validLocations = getValidLocations(board);
  let bestScore = 0;
  let bestColumn =
    validLocations[Math.floor(Math.random() * validLocations.length)];
  validLocations.forEach((column) => {
    const boardWithMove = insertCounterIntoColumn(board, column, piece);
    let score = scorePosition(boardWithMove, piece);
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

  res.status(200).json({ bestMove: pickBestMove(board, player) });
}
