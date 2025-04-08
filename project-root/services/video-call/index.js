// services/video-call/index.js
const { Server } = require("socket.io");
const handleRoomEvents = require("./rooms");

function setupVideoCall(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: "*", // Change later to frontend URL
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join-room", ({ roomId, userId }) => {
      socket.join(roomId);
      console.log(`User ${userId} joined room ${roomId}`);

      socket.to(roomId).emit("user-joined", userId);

      // 👇 Delegate room event handling to rooms.js
      handleRoomEvents(socket, roomId, userId);
    });
  });

  return io;
}

module.exports = { setupVideoCall };
