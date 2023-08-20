import { createContext, useState, useEffect } from "react";
import { setLocalStorage, getLocalStorage } from "../utils/localStorage";

export type Connect4GameContextType = {
  userOpponent: boolean;
  botOpponent: boolean;
  remoteOpponent: boolean;
  setOpponentType: (type: string) => void;
  userName?: string;
  setUserName?: (username: string) => void;
};

const initialConnect4GameContext: Connect4GameContextType = {
  userOpponent: false,
  botOpponent: false,
  remoteOpponent: false,
  userName: "",
  setUserName: () => {},
  setOpponentType: () => {},
};

export const Connect4GameContext = createContext<Connect4GameContextType>(
  initialConnect4GameContext
);

export default function GameContext({ children }) {
  const [userOpponent, setUserOpponent] = useState(() =>
    getLocalStorage("userOpponent", false)
  );
  const [botOpponent, setBotOpponent] = useState(() =>
    getLocalStorage("botOpponent", false)
  );
  const [remoteOpponent, setRemoteOpponent] = useState(() =>
    getLocalStorage("remoteOpponent", false)
  );

  const [userName, setUserName] = useState(() =>
    getLocalStorage("username", false)
  );

  useEffect(() => {
    setLocalStorage("userOpponent", userOpponent);
    setLocalStorage("botOpponent", botOpponent);
    setLocalStorage("remoteOpponent", remoteOpponent);
    setLocalStorage("username", userName);
  }, [userOpponent, botOpponent, remoteOpponent]);

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
        userName,
        setUserName,
      }}
    >
      {children}
    </Connect4GameContext.Provider>
  );
}
