import React, { useState, useEffect } from "react";
import useWindowSize from "../hooks/useWindowSize";
import axios from "axios";
import Player from "../types/Player";
import {
  insertCounterIntoColumn,
  changePlayer,
  checkWinningMove,
  clearBoard,
} from "../utils/game";
import {
  COLUMNS,
  EMPTY_CELL,
  hitZoneRangesLarge,
  hitZoneRangesSmall,
  ROWS,
  smallCounterRed,
  smallCounterYellow,
  largeCounterRed,
  largeCounterYellow,
  blackBoardSmall,
  blackBoardLarge,
  whiteBoardLarge,
  whiteBoardSmall,
} from "../utils/constants";

export default function Game() {
  const windowWidth = useWindowSize().width;

  const initialBoard: number[][] = Array.from({ length: ROWS }, () =>
    Array.from({ length: COLUMNS }, () => EMPTY_CELL)
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
      setTimeout(() => {
        getAIResponse(board, playerTwo.number).then((res) => {
          updateBoard(res.bestMove);
        });
      }, 500);
      setBlockPlayerMove(false);
    }
  }, [board]);

  const updateBoard = (columnHit: number) => {
    const updatedBoard = insertCounterIntoColumn(
      board,
      columnHit,
      currentPlayer.number
    );
    if (updatedBoard === null) return;

    if (checkWinningMove(updatedBoard, currentPlayer.number)) {
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

    setBoard(updatedBoard as number[][]);
    setCurrentPlayer(changePlayer(currentPlayer, playerOne, playerTwo));
  };

  const clickHandler = (e: any) => {
    if (blockPlayerMove || (currentPlayer === playerTwo && aiOpponentOn))
      return;
    const hitPoint = e.pageX - e.currentTarget.offsetLeft;
    const isLarge = windowWidth >= 1024;

    const hitZoneRanges = isLarge ? hitZoneRangesLarge : hitZoneRangesSmall;

    for (let i = 0; i < hitZoneRanges.length; i++) {
      if (
        hitPoint > hitZoneRanges[i].start &&
        hitPoint < hitZoneRanges[i].end
      ) {
        updateBoard(i);
        setBlockPlayerMove(true);
      }
    }
  };

  return (
    <div className="flex justify-center items-center w-screen h-screen">
      <h1 className="text-9xl px-12 text-white hidden lg:block">
        {playerOne.score}
      </h1>
      <div
        className="h-full flex items-center cursor-pointer z-10"
        onClick={clickHandler}
      >
        <div className="relative min-w-[335px] lg:min-w-[632px] max-w-[335px] lg:max-w-[632px]">
          <img
            src={blackBoardSmall}
            srcSet={`${blackBoardSmall} 335w, ${blackBoardLarge} 632w`}
            sizes="(max-width: 1023px) 335px, 632px"
            alt=""
            className="z-[-5] absolute top-0 left-0"
          />
          <div className="absolute w-[314px] lg:w-[592px] min-w-[314px] lg:min-w-[592px] h-[268px] lg:h-[504px] top-[10px] left-[10px] lg:top-[20px] lg:left-[20px]  grid grid-cols-7 grid-rows-6 gap-3 lg:gap-6 z-[-1]">
            {board.map((column, xIndex) => {
              return column.map((token, yIndex) => {
                return (
                  <div key={`${xIndex + yIndex}`}>
                    {token === 1 ? (
                      <img
                        src={smallCounterRed}
                        srcSet={`${smallCounterRed} 34w, ${largeCounterRed} 64w`}
                        sizes="(max-width: 1023px) 34px, 64px"
                        alt=""
                      />
                    ) : token === 2 ? (
                      <img
                        src={smallCounterYellow}
                        srcSet={`${smallCounterYellow} 34w, ${largeCounterYellow} 64w`}
                        sizes="(max-width: 1023px) 34px, 64px"
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
            src={whiteBoardSmall}
            srcSet={`${whiteBoardSmall} 335w, ${whiteBoardLarge} 632w`}
            sizes="(max-width: 1024px) 632px"
            alt=""
            className="z-20"
          />
        </div>
      </div>
      <h1 className="text-9xl px-12 text-white hidden lg:block">
        {playerTwo.score}
      </h1>
    </div>
  );
}
