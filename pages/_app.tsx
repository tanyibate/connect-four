import "../styles/globals.css";
import type { AppProps } from "next/app";
import GameContext from "../context/gameContext";
import SocketContextHOC from "../context/socketContext";
export default function App({ Component, pageProps }: AppProps) {
  return (
    <GameContext>
      <SocketContextHOC>
        <Component {...pageProps} />
      </SocketContextHOC>
    </GameContext>
  );
}
