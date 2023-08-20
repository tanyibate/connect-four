import { createContext, useState } from "react";
import socketio, { Socket } from "socket.io-client";

// Context to to store socket io socket instance
export type SocketContextType = {
  socket: Socket | null;
  initializeSocket?: () => void;
};

const initialSocketContext: SocketContextType = {
  socket: null,
};

export const Connect4SocketContext =
  createContext<SocketContextType>(initialSocketContext);

export default function SocketContextHOC({ children }) {
  const [socket, setSocket] = useState<null | Socket>(null);
  const initializeSocket = () => {
    const socket = socketio("http://localhost:8000/");
    setSocket(socket);
  };

  return (
    <Connect4SocketContext.Provider
      value={{
        socket,
        initializeSocket,
      }}
    >
      {children}
    </Connect4SocketContext.Provider>
  );
}
