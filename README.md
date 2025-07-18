[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=19954826&assignment_repo_type=AssignmentRepo)

# Real-Time Chat Application with Socket.io

This project is a real-time chat application built with React, Node.js, and Socket.io. It supports multiple chat rooms, user authentication, real-time notifications, typing indicators, and more.

## Features

- Real-time messaging using Socket.io
- User authentication (username login)
- Presence tracking (online users)
- Multiple chat rooms (join/create)
- Real-time notifications (user join/leave, new messages)
- Typing indicators

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Setup

#### 1. Install Server Dependencies

```
cd server
npm install
```

#### 2. Install Client Dependencies

```
cd ../client
npm install
```

#### 3. Start the Server

```
cd ../server
node server.js
```

#### 4. Start the Client

```
cd ../client
npm start
```

The client will run on http://localhost:3000 and the server on http://localhost:5000.

## Usage

- Enter a username and select or create a chat room to join.
- Send messages in real time with other users in the same room.
- See who is online and who is typing.
- Receive notifications when users join, leave, or send messages.

## Screenshots

Below is a sample screenshot of the chat application in action. Replace this image with your own screenshot or GIF.

![Sample Chat Screenshot](client/public/sample-chat-screenshot.png)

_To add your own screenshot:_

1. Take a screenshot or record a GIF of your running app.
2. Save it in the `client/public/` directory (e.g., `sample-chat-screenshot.png`).
3. Update the image path above if needed.

## Resources

- [Socket.io Documentation](https://socket.io/docs/v4/)
- [React Documentation](https://react.dev/)
- [Express.js Documentation](https://expressjs.com/)
- [Building a Chat Application with Socket.io](https://socket.io/get-started/chat)
