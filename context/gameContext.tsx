import { createContext, useState } from "react";

export const Connect4GameContext = createContext(null);

export default function GameContext({ children }) {
  const [userOpponent, setUserOpponent] = useState(false);
  const [botOpponent, setBotOpponent] = useState(false);
  const [remoteOpponent, setRemoteOpponent] = useState(false);

  const setOpponentType = (type) => {
    switch (type) {
      case "user":
        setUserOpponent(true);
        setBotOpponent(false);
        setRemoteOpponent(false);
        break;
      case "bot":
        setUserOpponent(false);
        setBotOpponent(true);
        setRemoteOpponent(false);
        break;
      case "remote":
        setUserOpponent(false);
        setBotOpponent(false);
        setRemoteOpponent(true);
        break;
      default:
        setUserOpponent(false);
        setBotOpponent(false);
        setRemoteOpponent(false);
    }
  };
  return (
    <Connect4GameContext.Provider
      value={{
        userOpponent,
        botOpponent,
        remoteOpponent,
        setOpponentType,
      }}
    >
      {children}
    </Connect4GameContext.Provider>
  );
}
