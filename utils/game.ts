import Player from "../types/Player";

export const insertCounterIntoColumn = (
  board: (Player | null)[][],
  column: number,
  player: Player
) => {
  console.log(board, column);
  const numOfRows = board[0].length;
  const copyOfBoard = [...board];
  for (let i = numOfRows - 1; i >= 0; i--) {
    if (copyOfBoard[column][i] === null) {
      copyOfBoard[column][i] = player;
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
  board: (Player | null)[][],
  xPositionOfToken: number,
  yPositionOfToken: number,
  player: Player
) => {
  const numOfColumns = board.length;
  for (let i = xPositionOfToken; i < xPositionOfToken + 4; i++) {
    if (i > numOfColumns - 1) return false;
    if (board[i][yPositionOfToken] !== player) return false;
  }
  console.log("east win");
  return true;
};

export const checkWestWin = (
  board: (Player | null)[][],
  xPositionOfToken: number,
  yPositionOfToken: number,
  player: Player
) => {
  for (let i = xPositionOfToken; i > xPositionOfToken - 4; i--) {
    if (i < 0) return false;
    if (board[i][yPositionOfToken] !== player) return false;
  }
  console.log("west win");
  return true;
};

export const checkNorthWin = (
  board: (Player | null)[][],
  xPositionOfToken: number,
  yPositionOfToken: number,
  player: Player
) => {
  for (let i = yPositionOfToken; i > yPositionOfToken - 4; i--) {
    if (i < 0) return false;
    if (board[xPositionOfToken][i] !== player) return false;
  }
  console.log("north win");
  return true;
};

export const checkSouthWin = (
  board: (Player | null)[][],
  xPositionOfToken: number,
  yPositionOfToken: number,
  player: Player
) => {
  const numOfRows = board[0].length;
  for (let i = yPositionOfToken; i < yPositionOfToken + 4; i++) {
    if (i > numOfRows - 1) return false;
    if (board[xPositionOfToken][i] !== player) return false;
  }
  console.log("south win");
  return true;
};
export const checkNorthEastWin = (
  board: (Player | null)[][],
  xPositionOfToken: number,
  yPositionOfToken: number,
  player: Player
) => {
  const numOfColumns = board.length;
  for (let i = 1; i < 4; i++) {
    if (xPositionOfToken + i > numOfColumns - 1 || yPositionOfToken - i < 0)
      return false;
    if (board[xPositionOfToken + i][yPositionOfToken - i] !== player)
      return false;
  }
  console.log("north east win");
  return true;
};

export const checkNorthWestWin = (
  board: (Player | null)[][],
  xPositionOfToken: number,
  yPositionOfToken: number,
  player: Player
) => {
  for (let i = 1; i < 4; i++) {
    if (xPositionOfToken - i < 0 || yPositionOfToken - i < 0) return false;
    if (board[xPositionOfToken - i][yPositionOfToken - i] !== player)
      return false;
  }
  console.log("north west win");
  return true;
};

export const checkSouthEastWin = (
  board: (Player | null)[][],
  xPositionOfToken: number,
  yPositionOfToken: number,
  player: Player
) => {
  const numOfColumns = board.length;
  const numOfRows = board[0].length;
  for (let i = 1; i < 4; i++) {
    if (
      xPositionOfToken + i > numOfColumns - 1 ||
      yPositionOfToken + i > numOfRows - 1
    )
      return false;
    if (board[xPositionOfToken + i][yPositionOfToken + i] !== player)
      return false;
  }
  console.log("south east win");
  return true;
};

export const checkSouthWestWin = (
  board: (Player | null)[][],
  xPositionOfToken: number,
  yPositionOfToken: number,
  player: Player
) => {
  const numOfRows = board[0].length;
  for (let i = 1; i < 4; i++) {
    if (xPositionOfToken - i < 0 || yPositionOfToken + i > numOfRows - 1)
      return false;
    if (board[xPositionOfToken - i][yPositionOfToken + i] !== player)
      return false;
  }
  console.log("south west win");
  return true;
};

export const clearBoard = (board: (Player | null)[][]) => {
  const copyOfBoard = [...board];
  for (let i = 0; i < copyOfBoard.length; i++) {
    for (let j = 0; j < copyOfBoard[0].length; j++) {
      copyOfBoard[i][j] = null;
    }
  }
  return copyOfBoard;
};
