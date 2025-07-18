const { Server } = require("socket.io");
const { log } = require("../utils/logger");

let users = {};
let rooms = ["General", "Random", "Tech"];
let typingUsers = {};

function setupSocket(server, clientUrl) {
  const io = new Server(server, {
    cors: {
      origin: clientUrl,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    log(`A user connected: ${socket.id}`);

    socket.on("create_room", (roomName) => {
      if (!rooms.includes(roomName)) {
        rooms.push(roomName);
        io.emit("room_list", rooms);
      }
    });

    socket.on("user_join", ({ username, room }) => {
      users[socket.id] = username;
      socket.join(room);
      io.to(room).emit("user_list", getUsersInRoom(room));
      socket.emit("room_list", rooms);
      io.to(room).emit("notification", `${username} joined the room.`);
    });

    socket.on("send_message", (data) => {
      io.to(data.room).emit("receive_message", data);
      io.to(data.room).emit("notification", `${data.user} sent a message.`);
    });

    socket.on("typing", ({ room, user, isTyping }) => {
      if (!typingUsers[room]) typingUsers[room] = new Set();
      if (isTyping) {
        typingUsers[room].add(user);
      } else {
        typingUsers[room].delete(user);
      }
      io.to(room).emit("typing_users", Array.from(typingUsers[room]));
    });

    socket.on("disconnecting", () => {
      for (const room of socket.rooms) {
        if (room !== socket.id) {
          io.to(room).emit(
            "notification",
            `${users[socket.id]} left the room.`
          );
          socket.leave(room);
          io.to(room).emit("user_list", getUsersInRoom(room));
          if (typingUsers[room]) {
            typingUsers[room].delete(users[socket.id]);
            io.to(room).emit("typing_users", Array.from(typingUsers[room]));
          }
        }
      }
      delete users[socket.id];
    });

    socket.on("disconnect", () => {
      log(`User disconnected: ${socket.id}`);
    });
  });

  function getUsersInRoom(room) {
    const sockets = Array.from(io.sockets.adapter.rooms.get(room) || []);
    return sockets.map((id) => users[id]).filter(Boolean);
  }
}

module.exports = { setupSocket };
