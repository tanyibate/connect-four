import Player from "../types/Player";

export const insertCounterIntoColumn = (
  board: number[][],
  column: number,
  player: number
) => {
  console.log("clicked");
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

export const changePlayer = (
  currentPlayer: Player,
  playerOne: Player,
  playerTwo: Player
) => {
  if (currentPlayer === playerOne) {
    return playerTwo;
  } else {
    return playerOne;
  }
};

export const checkWinningMove = (
  board: number[][],
  piece: number,
  returnWinningMove: boolean = false
): boolean | number[][] => {
  // Check horizontal locations for win
  for (let c = 0; c < board[0].length - 3; c++) {
    for (let r = 0; r < board.length; r++) {
      if (
        board[r][c] === piece &&
        board[r][c + 1] === piece &&
        board[r][c + 2] === piece &&
        board[r][c + 3] === piece
      ) {
        if (returnWinningMove) {
          return [
            [r, c],
            [r, c + 1],
            [r, c + 2],
            [r, c + 3],
          ];
        }
        return true;
      }
    }
  }
  // Check vertical locations for win
  for (let c = 0; c < board[0].length; c++) {
    for (let r = 0; r < board.length - 3; r++) {
      if (
        board[r][c] === piece &&
        board[r + 1][c] === piece &&
        board[r + 2][c] === piece &&
        board[r + 3][c] === piece
      ) {
        if (returnWinningMove) {
          return [
            [r, c],
            [r + 1, c],
            [r + 2, c],
            [r + 3, c],
          ];
        }
        return true;
      }
    }
  }
  // Check positively sloped diaganols
  for (let c = 0; c < board[0].length - 3; c++) {
    for (let r = 0; r < board.length - 3; r++) {
      if (
        board[r][c] === piece &&
        board[r + 1][c + 1] === piece &&
        board[r + 2][c + 2] === piece &&
        board[r + 3][c + 3] === piece
      ) {
        if (returnWinningMove) {
          return [
            [r, c],
            [r + 1, c + 1],
            [r + 2, c + 2],
            [r + 3, c + 3],
          ];
        }
        return true;
      }
    }
  }
  // Check negatively sloped diaganols
  for (let c = 0; c < board[0].length - 3; c++) {
    for (let r = 3; r < board.length; r++) {
      if (
        board[r][c] === piece &&
        board[r - 1][c + 1] === piece &&
        board[r - 2][c + 2] === piece &&
        board[r - 3][c + 3] === piece
      ) {
        if (returnWinningMove) {
          return [
            [r, c],
            [r - 1, c + 1],
            [r - 2, c + 2],
            [r - 3, c + 3],
          ];
        }
        return true;
      }
    }
  }
  return false;
};

export const clearBoard = (board: number[][]) => {
  const copyOfBoard = board.map(function (arr) {
    return arr.slice();
  }); // deep copy of board
  for (let i = 0; i < copyOfBoard.length; i++) {
    for (let j = 0; j < copyOfBoard[0].length; j++) {
      copyOfBoard[i][j] = 0;
    }
  }
  return copyOfBoard;
};
