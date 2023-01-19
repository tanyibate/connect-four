import React, { useState, useEffect } from "react";
import axios from "axios";
import Player from "../types/Player";
import { turn2DArrayIntoString, transposeArray } from "../utils/misc";
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
  const val = 0;

  const initialBoard: number[][] = Array.from({ length: ROWS }, () =>
    Array.from({ length: COLUMNS }, () => val)
  );

  const [board, setBoard] = useState(initialBoard);
  const [aiOpponentOn, setAiOpponentOn] = useState(true);
  const [blockPlayerMove, setBlockPlayerMove] = useState(false);
  const [playerOne, setPlayerOne] = useState({
    name: "Player One",
    score: 0,
    number: 1,
  });
  const [playerTwo, setPlayerTwo] = useState({
    name: "Player Two",
    score: 0,
    number: 2,
  });
  const [currentPlayer, setCurrentPlayer] = useState(playerOne);

  useEffect(() => {
    const getAIResponse = async (board: number[][], player: number) => {
      const response = await axios.post(
        "/api/ai",

        {
          board,
          player,
        }
      );
      return response.data;
    };
    if (aiOpponentOn && currentPlayer === playerTwo) {
      setBlockPlayerMove(true);
      setTimeout(() => {
        getAIResponse(board, playerTwo.number).then((res) => {
          console.log(res.bestMove);
          updateBoard(res.bestMove);
        });
      }, 100);
    }
    setBlockPlayerMove(false);
  }, [board]);

  const updateBoard = (columnHit: number) => {
    const updatedBoard = insertCounterIntoColumn(
      board,
      columnHit,
      currentPlayer.number
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
          currentPlayer.number
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

    setBoard(updatedBoard.board as number[][]);
    setCurrentPlayer(changePlayer(currentPlayer, playerOne, playerTwo));
  };

  const clickHandler = (e: any) => {
    const hitPoint = e.pageX - e.currentTarget.offsetLeft;
    const hitBoxWidth = 592;

    const hitZoneRangesLarge = [
      {
        start: 20,
        end: 84,
      },
      {
        start: 108,
        end: 172,
      },
      {
        start: 196,
        end: 260,
      },
      {
        start: 284,
        end: 348,
      },
      {
        start: 372,
        end: 436,
      },
      {
        start: 460,
        end: 524,
      },
      {
        start: 548,
        end: 612,
      },
    ];

    for (let i = 0; i < hitZoneRangesLarge.length; i++) {
      if (
        hitPoint > hitZoneRangesLarge[i].start &&
        hitPoint < hitZoneRangesLarge[i].end
      ) {
        updateBoard(i);
      }
    }
  };

  return (
    <div className="flex justify-center items-center w-screen h-screen">
      <h1 className="text-9xl px-12 text-white">{playerOne.score}</h1>
      <div
        className="h-full flex items-center cursor-pointer z-10"
        onClick={(event) => {
          if (!blockPlayerMove) clickHandler(event);
        }}
      >
        <div className="relative min-w-[632px]">
          <img
            src="./assets/images/board-layer-black-large.svg"
            alt=""
            className="z-[-5] absolute top-0 left-0"
          />
          <div className="absolute w-[592px] min-w-[592px] h-[504px] top-[20px] left-[20px]  grid grid-cols-7 grid-rows-6 gap-6 z-[-1]">
            {board.map((column, xIndex) => {
              return column.map((token, yIndex) => {
                return (
                  <div key={`${xIndex + yIndex}`}>
                    {token === 1 ? (
                      <img src="./assets/images/counter-red-large.svg" alt="" />
                    ) : token === 2 ? (
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
