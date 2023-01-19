import Player from "../types/Player";

export const transposeArray = (board: (Player | null)[][]) => {
  const copyOfBoard = board.map(function (arr) {
    return arr.slice();
  }); // deep copy of board
  return copyOfBoard[0].map((_, colIndex) =>
    copyOfBoard.map((row) => row[colIndex])
  );
};

export const turn2DArrayIntoString = (board: number[][]) => {
  return board.map((row) => row.join("")).join("");
};

export const turnStringInto2DArray = (board: string) => {};
