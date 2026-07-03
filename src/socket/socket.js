import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("🟢 Connected:", socket.id);

    socket.on("hello", (data) => {
      console.log(data);

      socket.emit("welcome", {
        message: `Welcome ${data.name}!`,
      });
    });

    socket.on("join-project", (projectId) => {
      socket.join(`project:${projectId}`);

      console.log(`${socket.id} joined project:${projectId}`);
    });

    socket.on("send-message", (data) => {
      console.log("Received:", data);

      io.to("project:project-101").emit("new-message", data);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO not initialized");
  }

  return io;
};