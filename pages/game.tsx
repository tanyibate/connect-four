import React, { useState, useEffect } from "react";
import Player from "../types/Player";
import {
  insertCounterIntoColumn,
  changePlayer,
  checkSouthWin,
  checkEastWin,
  checkNorthWin,
  checkWestWin,
  checkNorthEastWin,
  checkNorthWestWin,
  checkSouthEastWin,
  checkSouthWestWin,
  clearBoard,
} from "../utils/game";

export default function Game() {
  const ROWS = 6;
  const COLUMNS = 7;
  const val = null;

  const initialBoard: (Player | null)[][] = Array.from(
    { length: COLUMNS },
    () => Array.from({ length: ROWS }, () => val)
  );

  const [board, setBoard] = useState(initialBoard);
  const [playerOne, setPlayerOne] = useState({
    name: "Player One",
    score: 0,
  });
  const [playerTwo, setPlayerTwo] = useState({
    name: "Player Two",
    score: 0,
  });
  const [currentPlayer, setCurrentPlayer] = useState(playerOne);

  const clickHandler = (e) => {
    const hitPoint = e.pageX - e.currentTarget.offsetLeft;
    const hitBoxWidth = 592;
    const columnHit = Math.floor((hitPoint / hitBoxWidth) * COLUMNS);
    const updatedBoard = insertCounterIntoColumn(
      board,
      columnHit,
      currentPlayer
    );
    if (updatedBoard === null) return;
    const allWinConditions = [
      checkSouthWin,
      checkEastWin,
      checkNorthWin,
      checkWestWin,
      checkNorthEastWin,
      checkNorthWestWin,
      checkSouthEastWin,
      checkSouthWestWin,
    ];
    for (let i = 0; i < allWinConditions.length; i++) {
      if (
        allWinConditions[i](
          updatedBoard.board,
          updatedBoard.xPositionOfToken,
          updatedBoard.yPositionOfToken,
          currentPlayer
        )
      ) {
        alert(`${currentPlayer.name} has won!`);
        let copyOfPlayerOne = { ...playerOne };
        let copyOfPlayerTwo = { ...playerTwo };
        if (currentPlayer === playerOne) {
          copyOfPlayerOne.score += 1;
        } else {
          copyOfPlayerTwo.score += 1;
        }
        setPlayerOne(copyOfPlayerOne);
        setPlayerTwo(copyOfPlayerTwo);
        setBoard(clearBoard(board));
        setCurrentPlayer(copyOfPlayerOne);
        return;
      }
    }

    setBoard(updatedBoard.board as (Player | null)[][]);
    setCurrentPlayer(changePlayer(currentPlayer, playerOne, playerTwo));
  };

  return (
    <div className="flex justify-center items-center w-screen h-screen">
      <h1 className="text-9xl px-12 text-white">{playerOne.score}</h1>
      <div
        className="h-full flex items-center cursor-pointer z-10"
        onClick={clickHandler}
      >
        <div className="relative">
          <img
            src="./assets/images/board-layer-black-large.svg"
            alt=""
            className="z-[-5] absolute top-0 left-0"
          />
          <div className="absolute w-[592px] h-[504px] top-[20px] left-[20px] right-[20px] grid grid-cols-7 grid-rows-6 gap-6 z-[-1] grid-flow-col">
            {board.map((column, xIndex) => {
              return column.map((token, yIndex) => {
                return (
                  <div key={`${xIndex + yIndex}`}>
                    {token === playerOne ? (
                      <img src="./assets/images/counter-red-large.svg" alt="" />
                    ) : token === playerTwo ? (
                      <img
                        src="./assets/images/counter-yellow-large.svg"
                        alt=""
                      />
                    ) : (
                      ""
                    )}
                  </div>
                );
              });
            })}
          </div>
          <img
            src="./assets/images/board-layer-white-large.svg"
            alt=""
            className="z-20"
          />
        </div>
      </div>
      <h1 className="text-9xl px-12 text-white">{playerTwo.score}</h1>
    </div>
  );
}
