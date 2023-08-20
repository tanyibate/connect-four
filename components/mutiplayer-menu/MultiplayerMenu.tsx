import React, { useContext, useEffect, useState } from "react";
import { Connect4SocketContext } from "../../context/socketContext";
import Button from "../button/Button";
import { useRouter } from "next/router";
import styles from "./menu-styles.module.scss";
import Input from "../input/Input";
import { Connect4GameContext } from "../../context/gameContext";
import { join } from "path";

function UserNameSection({ cancel, confirm }) {
  const { setUserName } = useContext(Connect4GameContext);

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

function LobbySection({ id, cancel }) {
  const { socket } = useContext(Connect4SocketContext);
  const [players, setPlayers] = useState([]);

  const leaveRoom = () => {
    socket.emit("leave-room");
    cancel();
  };

  const getRoom = () => {
    socket.emit("get-room", id, (room) => {
      const players2 = [];
      room.sockets.forEach((roomSocket) => {
        players2.push({
          name: roomSocket.username,
          userSocket: roomSocket.id === socket.id,
        });
      });
      setPlayers(players2);
    });
  };

  useEffect(() => {
    if (players.length === 0) {
      getRoom();
    }
  }, []);

  socket.on("player-joined", () => {
    getRoom();
  });

  socket.on("player-left", () => {
    console.log("player left");
    getRoom();
  });

  return (
    <div className="w-screen h-screen flex flex-col justify-center sm:h-auto sm:w-auto">
      <div className="text-6xl my-6 text-center text-white ">Lobby</div>
      <div className="flex flex-col gap-y-4 w-full items-center p-4">
        {
          // @ts-ignore
          players.map((player) => (
            <div className="flex items-center gap-x-6">
              <div className="text-xl text-white">{player.name}</div>
              <img
                src={
                  player.userSocket
                    ? "/assets/images/player-one.svg"
                    : "/assets/images/player-two.svg"
                }
                alt=""
              />
            </div>
          ))
        }
      </div>
      <Button color="red" action={leaveRoom}>
        Cancel
      </Button>
    </div>
  );
}

function RoomOptionSection({ cancel, goToLobby, goToLobbyList }) {
  const { socket, initializeSocket } = useContext(Connect4SocketContext);
  const { userName } = useContext(Connect4GameContext);

  const [roomName, setRoomName] = useState("");
  useEffect(() => {
    if (!socket) initializeSocket();
  }, []);

  const createRoom = () => {
    socket.emit("create-room", roomName, (id) => {
      socket.emit("add-username", userName);
      goToLobby(id);
    });
  };

  return (
    <div className="w-screen h-screen flex flex-col justify-center sm:h-auto sm:w-auto">
      <div className="flex flex-col gap-y-8 w-full items-center divide-white divide-y divide-solid">
        <div className="space-y-4">
          <Input
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="Room name"
          />
          <Button color="white" action={createRoom}>
            Create Room
          </Button>
        </div>
        <div className="space-y-4 pt-2">
          <Button color="white" action={goToLobbyList}>
            Find Room
          </Button>
          <Button color="red" action={cancel}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}

function JoinRoomSection({ cancel, goToLobby }) {
  const { socket } = useContext(Connect4SocketContext);
  const { userName } = useContext(Connect4GameContext);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    socket.emit("get-rooms", undefined, (rooms) => {
      console.log(rooms);
      setRooms(rooms);
    });
  }, []);

  const joinRoom = (id) => {
    socket.emit("join-room", id, () => {
      socket.emit("add-username", userName);

      goToLobby(id);
    });
  };

  return (
    <div className="w-screen h-screen sm:h-auto sm:w-auto p-12  items-center justify-center">
      <div className="bg-black rounded-xl text white flex flex-col gap-y-4 divide-y-2 divide-solid divide white px-6 py-4 pt-0 mb-4 w-full">
        {rooms.map((room) => {
          return (
            <div
              key={room.id}
              className="text-xl text-white flex justify-between items-center w-full pt-4"
            >
              <div className="text-xl">{room.name}</div>
              <button
                type="button"
                className="rounded-3xl p-2 bg-purple text-white"
                onClick={() => joinRoom(room.id)}
              >
                JOIN
              </button>
            </div>
          );
        })}
      </div>
      <Button color="red" action={cancel}>
        Cancel
      </Button>
    </div>
  );
}
export default function Menu({ cancel }) {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const { socket } = useContext(Connect4SocketContext);
  const [lobbyID, setLobbyID] = useState<number | undefined>(undefined);

  const goToLobby = (id: any) => {
    setLobbyID(id);
    setCurrentSlide(2);
  };

  const goToLobbyList = () => {
    setCurrentSlide(3);
  };

  const menuSlides = [
    <UserNameSection
      cancel={cancel}
      confirm={() => setCurrentSlide(currentSlide + 1)}
      key={0 + "slide"}
    />,
    <RoomOptionSection
      key={1 + "slide"}
      cancel={cancel}
      goToLobby={goToLobby}
      goToLobbyList={goToLobbyList}
    />,
    <LobbySection id={lobbyID} key={2 + "slide"} cancel={cancel} />,
    <JoinRoomSection key={3 + "slide"} cancel={cancel} goToLobby={goToLobby} />,
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
