// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { Server } from "socket.io";
const rooms = [];

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log(socket.id);
      socket.on("input-change", (msg) => {
        socket.broadcast.emit("update-input", msg);
        console.log(msg);
      });

      socket.on("hello-world", (msg) => {
        console.log(msg);
      });

      socket.on("create-room", (room) => {
        console.log("room created");
        socket.join("123");
        rooms.push(room);
        socket.broadcast.emit("room-created", "123");
      });

      socket.on("join-room", (room) => {
        socket.join("123");
        socket.to("123").emit("room-joined", "123 joined");
      });

      socket.on("get-rooms", () => {
        socket.emit("rooms", rooms);
      });

      socket.on("disconnect", () => {
        // socket.rooms.size === 0
      });
    });
  }
  res.end();
};

export default SocketHandler;
