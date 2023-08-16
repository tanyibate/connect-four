import React, { useState, useEffect, useContext } from "react";
import { Connect4GameContext } from "../context/gameContext";
import useWindowSize from "../hooks/useWindowSize";
import axios from "axios";
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
  blackBoardSmall,
  blackBoardLarge,
  whiteBoardLarge,
  whiteBoardSmall,
} from "../utils/constants";
import ScoreBoard from "../components/scoreBoard/ScoreBoard";
import Board from "../components/board/Board";

export type Player = {
  name: string;
  score: number;
  number: number;
};

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
  const [playerOne, setPlayerOne] = useState<Player>({
    name: "PLAYER 1",
    score: 0,
    number: 1,
  });
  const [playerTwo, setPlayerTwo] = useState<Player>({
    name: botOpponent ? "CPU" : "PLAYER 2",
    score: 0,
    number: 2,
  });
  const [currentPlayer, setCurrentPlayer] = useState(playerOne);
  const [userPlayer, setUserPlayer] = useState(playerOne);
  const [gameActive, setGameActive] = useState(true);
  const [numberOfSecondsRemaining, setNumberOfSecondsRemaining] = useState(15);
  const [mostRecentWinner, setMostRecentWinner] = useState<Player | undefined>(
    undefined
  );

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
  }, [currentPlayer]);

  // Use effect to automatically change a player after 15 seconds if the game is still active
  useEffect(() => {
    if (gameActive) setNumberOfSecondsRemaining(15);
    const maximumTime = setInterval(() => {
      if (gameActive) {
        setCurrentPlayer(changePlayer(currentPlayer, playerOne, playerTwo));
      }
    }, 15000);

    return () => {
      console.log("clearing");
      clearTimeout(maximumTime);
    };
  }, [
    currentPlayer,
    gameActive,
    setCurrentPlayer,
    changePlayer,
    setNumberOfSecondsRemaining,
    playerOne,
    playerTwo,
  ]);

  // Use effect to count down the number of seconds remaining
  useEffect(() => {
    const countDown = setInterval(() => {
      if (gameActive && numberOfSecondsRemaining > 0) {
        setNumberOfSecondsRemaining((prev) => prev - 1);
      }
    }, 1000);
    return () => {
      clearTimeout(countDown);
    };
  }, [numberOfSecondsRemaining, gameActive, setNumberOfSecondsRemaining]);

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
      setMostRecentWinner(currentPlayer);
      return;
    }

    setBoard(updatedBoard as number[][]);
    setCurrentPlayer(changePlayer(currentPlayer, playerOne, playerTwo));
  };

  const clickHandler = (e: any) => {
    if (
      blockPlayerMove ||
      (currentPlayer === playerTwo && botOpponent) ||
      (currentPlayer !== userPlayer && remoteOpponent) ||
      !gameActive
    )
      return;
    const hitPoint = e.pageX - e.currentTarget.offsetLeft;
    const isLarge = windowWidth >= 768;

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
    setBlockPlayerMove(false);
  };

  return (
    <div className="flex justify-center items-center w-screen h-screen max-h-screen overflow-auto">
      <div className="hidden xl:block">
        <ScoreBoard large player={playerOne} />
      </div>
      <div
        className="h-full flex items-center justify-center gap-y-4 flex-col cursor-pointer z-10 min-w-[335px] md:min-w-[632px] max-w-[335px] md:max-w-[632px]"
        onClick={clickHandler}
      >
        <div className="relative w-full z-20">
          <div className="w-full z-50 absolute -top-4 -translate-y-full">
            <div className="w-full flex justify-between"></div>
            <div className="flex justify-between min-w-full px-7 xl:hidden">
              <ScoreBoard player={playerOne} />
              <ScoreBoard player={playerTwo} />
            </div>
          </div>
          <img
            src={blackBoardSmall}
            srcSet={`${blackBoardSmall} 335w, ${blackBoardLarge} 632w`}
            sizes="(max-width: 767px) 335px, 632px"
            alt=""
            className="z-[-5] absolute top-0 left-0"
          />
          <Board board={board} />
          <img
            src={whiteBoardSmall}
            srcSet={`${whiteBoardSmall} 335w, ${whiteBoardLarge} 632w`}
            sizes="(max-width: 767px) 632px"
            alt=""
            className="z-20"
          />
          {gameActive && (
            <div className="absolute left-1/2 -translate-x-1/2 top-[92.5%]">
              <div className="absolute top-0 left-0 py-10 px-6 text-black w-full h-full text-center space-y-2">
                <div className="text-sm lg:text-base">
                  {currentPlayer.name}&apos;S TURN
                </div>
                <div className="text-4xl">{numberOfSecondsRemaining}s</div>
              </div>
              {currentPlayer.number === 1 ? (
                <img src="/assets/images/turn-background-red.svg" alt="" />
              ) : (
                <img src="/assets/images/turn-background-yellow.svg" alt="" />
              )}
            </div>
          )}
          {!gameActive && (
            <div className="h-[160px] w-[285px absolute left-1/2 -translate-x-1/2 top-[92.5%]">
              <img
                src="/assets/images/winner-background.png"
                alt=""
                className="w-full h-full"
              />
              <div className="absolute top-0 left-0 h-full w-full flex flex-col justify-evenly items-center py-4">
                <div className="text-base">{mostRecentWinner.name}</div>
                <div className="text-4xl">WINS</div>
                <div
                  className="text-white text-base rounded-xl bg-dark-purple px-4 py-1 cursor-pointer"
                  onClick={resetGame}
                >
                  PLAY AGAIN
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="hidden xl:block">
        <ScoreBoard large player={playerTwo} />
      </div>{" "}
    </div>
  );
}
