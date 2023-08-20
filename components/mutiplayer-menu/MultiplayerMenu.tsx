import React, { useContext, useEffect, useState } from "react";
import { Connect4SocketContext } from "../../context/socketContext";
import Button from "../button/Button";
import { useRouter } from "next/router";
import styles from "./menu-styles.module.scss";
import Input from "../input/Input";
import { Connect4GameContext } from "../../context/gameContext";

function UserNameSection({ setUserName, cancel, confirm }) {
  return (
    <div className="w-screen h-screen flex flex-col justify-center sm:h-auto sm:w-auto">
      <div className="text-6xl my-6 text-center text-white ">
        Choose a username
      </div>
      <div className="flex flex-col gap-y-4 w-full items-center">
        <Input
          onChange={(event) => setUserName(event.target.value)}
          placeholder="Enter your username..."
        />
        <Button color="red" action={cancel}>
          Cancel
        </Button>
        <Button color="white" action={confirm}>
          OK
        </Button>
      </div>
    </div>
  );
}

function LobbySection({ id }) {
  const { socket } = useContext(Connect4SocketContext);
  const [players, setPlayers] = useState([]);

  return (
    <div className="w-screen h-screen flex flex-col justify-center sm:h-auto sm:w-auto">
      <div className="text-6xl my-6 text-center text-white ">Lobby</div>
      <div className="flex flex-col gap-y-4 w-full items-center">
        <div className="flex gap-x-2">
          <div></div>
          <img src="" alt="" />
        </div>
      </div>
    </div>
  );
}

function RoomOptionSection() {
  const { socket, initializeSocket } = useContext(Connect4SocketContext);
  const [roomName, setRoomName] = useState("");
  useEffect(() => {
    initializeSocket();
  }, []);
  const createRoom = () => {
    socket.emit("create-room", "Room123", (value) => {
      console.log(value);
    });
  };
  const getRooms = () => {
    socket.emit("get-rooms", undefined, (value) => {
      console.log(value);
    });
  };
  return (
    <div className="w-screen h-screen flex flex-col justify-center sm:h-auto sm:w-auto">
      <div className="flex flex-col gap-y-8 w-full items-center divide-x-8 divide-white">
        <div className="space-y-4">
          <Input
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="Room name"
          />
          <Button color="red" action={createRoom}>
            Create Room
          </Button>
        </div>
        <Button color="white" action={getRooms}>
          Join Room
        </Button>
      </div>
    </div>
  );
}

export default function Menu({ cancel }) {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  const { setUserName } = useContext(Connect4GameContext);
  const menuSlides = [
    <UserNameSection
      cancel={cancel}
      confirm={() => setCurrentSlide(currentSlide + 1)}
      setUserName={setUserName}
    />,
    <RoomOptionSection />,
  ];

  return (
    <div className="w-full h-full bg-black bg-opacity-25 fixed z-50 flex items-center justify-center">
      <div
        className={
          "bg-dark-purple px-4 py-8 rounded-xl pb-12 max-w-3/4 " + styles.menu
        }
      >
        {menuSlides[currentSlide]}
      </div>
    </div>
  );
}
