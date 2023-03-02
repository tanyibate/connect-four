import "../styles/globals.css";
import type { AppProps } from "next/app";
import GameContext from "../context/gameContext";
export default function App({ Component, pageProps }: AppProps) {
  return (
    <GameContext>
      <Component {...pageProps} />
    </GameContext>
  );
}
