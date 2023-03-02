import { createContext, useState } from "react";

import React from "react";

export const GameContext = createContext();

export default function gameContext({ children }) {
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
    <GameContext.Provider
      value={{
        userOpponent,
        botOpponent,
        remoteOpponent,
        setOpponentType,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}
