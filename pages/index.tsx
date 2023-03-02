import { GameContext } from "../context/GameContext";
import { useContext } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const goToGame = (opponentType) => {
    setOpponentType(opponentType);
    router.push("/game");
  };
  const { setOpponentType } = useContext(GameContext);
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-y-4">
      <button
        className="w-64 h-16  rounded-md bg-purple-200 shadow-2xl"
        onClick={() => goToGame("user")}
      >
        Player vs Player
      </button>
      <button
        className="w-64 h-16 rounded-md bg-purple-200 shadow-2xl"
        onClick={() => goToGame("bot")}
      >
        Player vs CPU
      </button>
      <button
        className="w-64 h-16 rounded-md bg-purple-200 shadow-2xl"
        onClick={() => goToGame("remote")}
      >
        Online
      </button>
    </div>
  );
}
