// server.js
import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://192.168.0.103:5173"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("join_session", ({ session_id }) => {
    socket.join(session_id);
    console.log(`User ${socket.id} joined room: ${session_id}`);
  });

  socket.on("sendMessage", (messageData) => {
    console.log("Message received:", messageData);
    const { session_id } = messageData;
    socket.to(session_id).emit("receiveMessage", messageData);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

export { io, server, app };
