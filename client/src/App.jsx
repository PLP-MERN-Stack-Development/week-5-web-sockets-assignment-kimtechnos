import React, { useState, useEffect, useRef } from "react";
import socket from "./socket/socket";
import "./App.css";

const DEFAULT_ROOMS = ["General", "Random", "Tech"];

function App() {
  const [username, setUsername] = useState("");
  const [inputName, setInputName] = useState("");
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [users, setUsers] = useState([]);
  const [room, setRoom] = useState("");
  const [rooms, setRooms] = useState(DEFAULT_ROOMS);
  const [newRoom, setNewRoom] = useState("");
  const [notification, setNotification] = useState("");
  const [typingUsers, setTypingUsers] = useState([]);
  const typingTimeout = useRef(null);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      if (data.room === room) {
        setChat((prev) => [...prev, data]);
      }
    });
    socket.on("user_list", (userList) => {
      setUsers(userList);
    });
    socket.on("room_list", (roomList) => {
      setRooms(roomList);
    });
    socket.on("notification", (msg) => {
      setNotification(msg);
      setTimeout(() => setNotification(""), 3000);
    });
    socket.on("typing_users", (usersTyping) => {
      setTypingUsers(usersTyping.filter((u) => u !== username));
    });
    return () => {
      socket.off("receive_message");
      socket.off("user_list");
      socket.off("room_list");
      socket.off("notification");
      socket.off("typing_users");
    };
  }, [room, username]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (inputName.trim() && room) {
      setUsername(inputName);
      socket.emit("user_join", { username: inputName, room });
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && username && room) {
      socket.emit("send_message", { user: username, text: message, room });
      setMessage("");
      socket.emit("typing", { room, user: username, isTyping: false });
    }
  };

  const handleRoomSelect = (e) => {
    setRoom(e.target.value);
  };

  const handleCreateRoom = (e) => {
    e.preventDefault();
    if (newRoom.trim() && !rooms.includes(newRoom)) {
      socket.emit("create_room", newRoom);
      setRoom(newRoom);
      setNewRoom("");
    }
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    socket.emit("typing", { room, user: username, isTyping: true });
    typingTimeout.current = setTimeout(() => {
      socket.emit("typing", { room, user: username, isTyping: false });
    }, 1500);
  };

  if (!username) {
    return (
      <div style={{ maxWidth: 400, margin: "2rem auto" }}>
        <h2>Login to Chat</h2>
        <form onSubmit={handleLogin}>
          <input
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            placeholder="Enter your username..."
            style={{ width: "80%" }}
          />
          <div style={{ margin: "10px 0" }}>
            <select
              value={room}
              onChange={handleRoomSelect}
              style={{ width: "80%" }}
            >
              <option value="">Select a room...</option>
              {rooms.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div style={{ margin: "10px 0" }}>
            <form onSubmit={handleCreateRoom} style={{ display: "flex" }}>
              <input
                value={newRoom}
                onChange={(e) => setNewRoom(e.target.value)}
                placeholder="Or create a new room"
                style={{ width: "70%" }}
              />
              <button type="submit" style={{ width: "28%" }}>
                Create
              </button>
            </form>
          </div>
          <button type="submit" style={{ width: "18%" }}>
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto" }}>
      <h2>Socket.io Chat</h2>
      <div style={{ marginBottom: 10 }}>
        <strong>Logged in as:</strong> {username}
      </div>
      <div style={{ marginBottom: 10 }}>
        <strong>Room:</strong> {room}
      </div>
      <div style={{ marginBottom: 10 }}>
        <strong>Online users:</strong> {users.join(", ")}
      </div>
      {notification && (
        <div
          style={{
            background: "#e0e0e0",
            padding: "5px",
            marginBottom: 10,
            borderRadius: 4,
          }}
        >
          {notification}
        </div>
      )}
      {typingUsers.length > 0 && (
        <div style={{ color: "#888", marginBottom: 5 }}>
          {typingUsers.join(", ")} {typingUsers.length === 1 ? "is" : "are"}{" "}
          typing...
        </div>
      )}
      <div style={{ border: "1px solid #ccc", minHeight: 200, padding: 10 }}>
        {chat.map((msg, idx) => (
          <div key={idx}>
            <b>{msg.user}:</b> {msg.text}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} style={{ marginTop: 10 }}>
        <input
          value={message}
          onChange={handleTyping}
          placeholder="Type a message..."
          style={{ width: "80%" }}
        />
        <button type="submit" style={{ width: "18%" }}>
          Send
        </button>
      </form>
    </div>
  );
}

export default App;
