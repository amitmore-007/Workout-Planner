// services/video-call/index.js
const { Server } = require("socket.io");

function setupVideoCall(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: "*", // Later restrict to frontend URL
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join-room", ({ roomId, userId }) => {
      socket.join(roomId);
      console.log(`User ${userId} joined room ${roomId}`);

      socket.to(roomId).emit("user-joined", userId);

      socket.on("send-offer", (data) => {
        socket.to(roomId).emit("receive-offer", data);
      });

      socket.on("send-answer", (data) => {
        socket.to(roomId).emit("receive-answer", data);
      });

      socket.on("send-ice", (data) => {
        socket.to(roomId).emit("receive-ice", data);
      });

      socket.on("disconnect", () => {
        socket.to(roomId).emit("user-disconnected", userId);
        console.log(`User ${userId} left room ${roomId}`);
      });
    });
  });

  return io;
}

module.exports = { setupVideoCall };
