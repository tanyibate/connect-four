import React, { useEffect, useState } from "react";
import io from "socket.io-client";

let socket;

export default function Lobby() {
  useEffect(() => {
    socketInitializer();
  }, []);

  const [room, setRoom] = useState<string>("");

  const socketInitializer = async () => {
    socket = io("http://localhost:4000");

    socket.on("connect", () => {
      console.log("connected");
    });

    socket.on("room-joined", (msg) => {
      console.log(msg);
    });

    socket.on("room-created", (msg) => {
      console.log(msg);
    });
  };

  const createRoom = (e: any) => {
    socket.emit("input-change", { name: "hello" });
    socket.emit("create-room", { name: "hello" });
  };

  const joinRoom = (e: any) => {
    socket.emit("join-room", { name: "hello" });
  };
  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-y-4">
      <button
        className="w-64 h-32 bg-blue-200 text-blue text-3xl"
        onClick={createRoom}
      >
        {room}
      </button>
      <button
        className="w-64 h-32 bg-blue-200 text-blue text-3xl"
        onClick={joinRoom}
      >
        join room
      </button>
    </div>
  );
}
