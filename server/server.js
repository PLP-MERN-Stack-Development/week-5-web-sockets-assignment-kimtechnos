// server.js - Main server file for Socket.io chat application

const express = require("express");
const http = require("http");
const cors = require("cors");
const { log } = require("./utils/logger");
const { setupSocket } = require("./socket");
const { PORT, CLIENT_URL } = require("./config");

const app = express();
app.use(cors());

const server = http.createServer(app);

const chatRoutes = require("./routes/chat");
app.use("/api", chatRoutes);

setupSocket(server, CLIENT_URL);

server.listen(PORT, () => {
  log(`Server running on port ${PORT}`);
});
