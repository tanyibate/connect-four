import React, { useState, useEffect, useContext } from "react";
import { Connect4GameContext } from "../context/gameContext";
//import io from "socket.io-client";

import useWindowSize from "../hooks/useWindowSize";
import axios from "axios";
//import Player from "../types/Player";
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

//let socket;

export default function Game() {
  const windowWidth = useWindowSize().width;

  const initialBoard: number[][] = Array.from({ length: ROWS }, () =>
    Array.from({ length: COLUMNS }, () => EMPTY_CELL)
  );
  const { opponentType, remoteOpponent, botOpponent, userOpponent } =
    useContext(Connect4GameContext);
  const [input, setInput] = useState("");
  const [board, setBoard] = useState(initialBoard);
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
  const [userPlayer, setUserPlayer] = useState(playerOne);
  const [gameActive, setGameActive] = useState(true);

  /*useEffect(() => {
    socketInitializer();
  }, []);*/

  /*const onChangeHandler = (e) => {
    setInput(e.target.value);
    socket.emit("input-change", e.target.value);
  };*/

  /*const socketInitializer = async () => {
    await fetch("/api/multiplayer");
    socket = io();

    socket.on("connect", () => {
      console.log("connected");
    });

    socket.on("update-input", (msg) => {
      setInput(msg);
    });
  };*/

  useEffect(() => {
    const getAIResponse = async (board: number[][], player: number) => {
      const response = await axios.post("/api/ai", {
        board,
        player,
      });
      return response.data;
    };
    if (botOpponent && currentPlayer === playerTwo) {
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
    const winningMove = checkWinningMove(
      updatedBoard,
      currentPlayer.number,
      true
    );

    if (typeof winningMove != "boolean") {
      alert(`${currentPlayer.name} has won!`);
      winningMove.forEach((cell) => {
        updatedBoard[cell[0]][cell[1]] = currentPlayer.number + 2;
      });
      let copyOfPlayerOne = { ...playerOne };
      let copyOfPlayerTwo = { ...playerTwo };
      if (currentPlayer === playerOne) {
        copyOfPlayerOne.score += 1;
      } else {
        copyOfPlayerTwo.score += 1;
      }
      setPlayerOne(copyOfPlayerOne);
      setPlayerTwo(copyOfPlayerTwo);
      setBoard(updatedBoard);
      //setBoard(clearBoard(board));
      setCurrentPlayer(copyOfPlayerOne);
      setGameActive(false);
      return;
    }

    setBoard(updatedBoard as number[][]);
    setCurrentPlayer(changePlayer(currentPlayer, playerOne, playerTwo));
  };

  const clickHandler = (e: any) => {
    //socket.emit("hello-world", { input: "hello" });

    if (
      blockPlayerMove ||
      (currentPlayer === playerTwo && botOpponent) ||
      (currentPlayer !== userPlayer && remoteOpponent) ||
      !gameActive
    )
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
        if (remoteOpponent || botOpponent) setBlockPlayerMove(true);
      }
    }
  };

  const resetGame = () => {
    setBoard(clearBoard(board));
    setGameActive(true);
  };

  return (
    <div className="flex justify-center items-center w-screen h-screen">
      <h1 className="text-9xl px-12 text-white hidden lg:block">
        {playerOne.score}
      </h1>
      <div
        className="h-full flex items-center justify-center gap-y-4 flex-col  cursor-pointer z-10"
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
                  <div key={`${xIndex + yIndex}`} className="relative">
                    {token === 1 || token === 3 ? (
                      <img
                        src={smallCounterRed}
                        srcSet={`${smallCounterRed} 34w, ${largeCounterRed} 64w`}
                        sizes="(max-width: 1023px) 34px, 64px"
                        alt=""
                      />
                    ) : token === 2 || token === 4 ? (
                      <img
                        src={smallCounterYellow}
                        srcSet={`${smallCounterYellow} 34w, ${largeCounterYellow} 64w`}
                        sizes="(max-width: 1023px) 34px, 64px"
                        alt=""
                      />
                    ) : (
                      ""
                    )}
                    {(token === 3 || token === 4) && (
                      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-4 lg:border-8 border-white border-solid rounded-full h-1/2 w-1/2"></div>
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
        <div className="flex justify-between lg:hidden w-full px-6">
          <h1 className="text-6xl text-white">{playerOne.score}</h1>
          <h1 className="text-6xl text-white">{playerTwo.score}</h1>
        </div>
        {!gameActive && (
          <div
            className="text-6xl text-white cursor-pointer"
            onClick={resetGame}
          >
            Play again
          </div>
        )}
      </div>
      <h1 className="text-9xl px-12 text-white hidden lg:block">
        {playerTwo.score}
      </h1>

      {/*<input
        placeholder="Type something"
        value={input}
        onChange={onChangeHandler}
        className="border-2 border-black fixed top-0 left-0"
        />*/}
    </div>
  );
}
