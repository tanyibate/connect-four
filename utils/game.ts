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
      return {
        board: copyOfBoard,
        xPositionOfToken: column,
        yPositionOfToken: i,
      };
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

export const checkEastWin = (
  board: number[][],
  xPositionOfToken: number,
  yPositionOfToken: number,
  player: number
) => {
  const numOfColumns = board[0].length;
  for (let i = xPositionOfToken; i < xPositionOfToken + 4; i++) {
    if (i > numOfColumns - 1) return false;
    if (board[yPositionOfToken][i] !== player) return false;
  }
  console.log("east win");
  return true;
};

export const checkWestWin = (
  board: number[][],
  xPositionOfToken: number,
  yPositionOfToken: number,
  player: number
) => {
  for (let i = xPositionOfToken; i > xPositionOfToken - 4; i--) {
    if (i < 0) return false;
    if (board[yPositionOfToken][i] !== player) return false;
  }
  console.log("west win");
  return true;
};

export const checkNorthWin = (
  board: number[][],
  xPositionOfToken: number,
  yPositionOfToken: number,
  player: number
) => {
  for (let i = yPositionOfToken; i > yPositionOfToken - 4; i--) {
    if (i < 0) return false;
    if (board[i][xPositionOfToken] !== player) return false;
  }
  console.log("north win");
  return true;
};

export const checkSouthWin = (
  board: number[][],
  xPositionOfToken: number,
  yPositionOfToken: number,
  player: number
) => {
  const numOfRows = board.length;
  for (let i = yPositionOfToken; i < yPositionOfToken + 4; i++) {
    if (i > numOfRows - 1) return false;
    if (board[i][xPositionOfToken] !== player) return false;
  }
  console.log("south win");
  return true;
};
export const checkNorthEastWin = (
  board: number[][],
  xPositionOfToken: number,
  yPositionOfToken: number,
  player: number
) => {
  const numOfColumns = board[0].length;
  for (let i = 1; i < 4; i++) {
    if (xPositionOfToken + i > numOfColumns - 1 || yPositionOfToken - i < 0)
      return false;
    if (board[yPositionOfToken - i][xPositionOfToken + i] !== player)
      return false;
  }
  console.log("north east win");
  return true;
};

export const checkNorthWestWin = (
  board: number[][],
  xPositionOfToken: number,
  yPositionOfToken: number,
  player: number
) => {
  for (let i = 1; i < 4; i++) {
    if (xPositionOfToken - i < 0 || yPositionOfToken - i < 0) return false;
    if (board[yPositionOfToken - i][xPositionOfToken - i] !== player)
      return false;
  }
  console.log("north west win");
  return true;
};

export const checkSouthEastWin = (
  board: number[][],
  xPositionOfToken: number,
  yPositionOfToken: number,
  player: number
) => {
  const numOfColumns = board[0].length;
  const numOfRows = board.length;
  for (let i = 1; i < 4; i++) {
    if (
      xPositionOfToken + i > numOfColumns - 1 ||
      yPositionOfToken + i > numOfRows - 1
    )
      return false;
    if (board[yPositionOfToken + i][xPositionOfToken + i] !== player)
      return false;
  }
  console.log("south east win");
  return true;
};

export const checkSouthWestWin = (
  board: number[][],
  xPositionOfToken: number,
  yPositionOfToken: number,
  player: number
) => {
  const numOfRows = board.length;
  for (let i = 1; i < 4; i++) {
    if (xPositionOfToken - i < 0 || yPositionOfToken + i > numOfRows - 1)
      return false;
    if (board[yPositionOfToken + i][xPositionOfToken - i] !== player)
      return false;
  }
  console.log("south west win");
  return true;
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
