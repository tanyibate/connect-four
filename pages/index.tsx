import { Connect4GameContext } from "../context/gameContext";
import { useContext, useState } from "react";
import { useRouter } from "next/router";
import Button from "../components/button/Button";
import styles from "../styles/Home.module.css";
import MultiplayerMenu from "../components/mutiplayer-menu/MultiplayerMenu";

export default function Home() {
  const router = useRouter();
  const goToGame = (opponentType) => {
    setOpponentType(opponentType);
    router.push("/game");
  };
  const { setOpponentType } = useContext(Connect4GameContext);
  const [MultiplayerMenuActive, setMultiplayerMenuActive] = useState(false);
  return (
    <div className="w-full h-full flex justify-center items-center bg-dark-purple">
      <div className={styles.selector_container}>
        <Button
          action={() => goToGame("user")}
          color="yellow"
          iconUrl={"/assets/images/player-vs-player.svg"}
        >
          Play vs Player
        </Button>
        <Button
          action={() => goToGame("bot")}
          color="red"
          iconUrl={"/assets/images/player-vs-cpu.svg"}
        >
          Play vs CPU
        </Button>
        <Button
          action={() => setMultiplayerMenuActive(true)}
          iconUrl={"/assets/images/player-vs-player.svg"}
        >
          Play Online
        </Button>
      </div>
      {MultiplayerMenuActive && (
        <MultiplayerMenu cancel={() => setMultiplayerMenuActive(false)} />
      )}
    </div>
  );
}
