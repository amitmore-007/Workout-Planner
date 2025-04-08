// services/video-call/rooms.js

function handleRoomEvents(socket, roomId, userId) {
    console.log(`Handling WebRTC events for user ${userId} in room ${roomId}`);
  
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
  }
  
  module.exports = handleRoomEvents;
  