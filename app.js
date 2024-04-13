import dotenv from "dotenv";
import express from "express";
import http from "http";
import cors from "cors";
import helmet from "helmet";
import { Server } from "socket.io";
import mongoose from "mongoose";
import morgan from "morgan";

import { errorHandler } from "./middlewares.mjs";
import AppRouter from "./api/appRouter.mjs";
import MessageDAO from "./dao/messageDAO.mjs";

dotenv.config();

// Setting up express & must use middleware
let app = express();
app.use(cors());
app.use(morgan("tiny"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("trust proxy", 1); // When using something like nginx or apache as a proxy
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        "default-src": [
          "'self'",
          "ws:",
          "*.bootstrapcdn.com",
          "*.googleapis.com",
          "*.gstatic.com",
        ],
        "script-src": [
          "'self'",
          "*.bootstrapcdn.com",
          "*.cloudflare.com",
          "*.jquery.com",
          "*.googleapis.com",
        ],
        "img-src": ["'self'", "data:", "blob:", "*.w3.org"],
      },
    },
  })
); // Adds extra security
app.use(errorHandler);
app.use("/api", AppRouter);

// Basic Routing
app.get("/robots.txt", (req, res) =>
  res.sendFile("robots.txt", { root: __dirname })
);
app.get("*", (req, res) =>
  res.sendFile("index.html", { root: __dirname + "/../build/" })
);

mongoose
  .set("strictQuery", false)
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => console.log(err));

// Setting up node js server
let port = process.env.PORT || 3003;
let httpServer = http.createServer(app);

const io = new Server(httpServer, {
  transports: ["polling"],
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("A user is connected");

  socket.on("join", (chatId, callback) => {
    console.log("Joining chat room", chatId, socket.id, callback, socket.rooms);
    try {
      socket.join(chatId);
      socket.chatId = chatId;

      console.log(
        "Joined chat room",
        chatId,
        socket.id,
        callback,
        socket.rooms
      );

      const clients = io.sockets.adapter.rooms.get(chatId);
      const numClients = clients ? clients.size : 0;
      console.log(`Number of clients in room: ${numClients}`, clients, chatId);

      callback({
        status: "ok",
      });
    } catch (err) {
      console.error(`Failed to join chat. ${err}`);
    }
  });

  socket.on("leave", (chatId, callback) => {
    console.log("Leaving chat room", chatId, socket.id, callback, socket.rooms);
    try {
      socket.leave(chatId);

      console.log("Left room", chatId, socket.id, callback, socket.rooms);

      callback({
        status: "ok",
      });
    } catch (err) {
      console.error(`Failed to leave chat. ${err}`);
    }
  });

  // socket.on("disconnect", (reason) => {
  //   console.log(`Client is diconnecting. ${reason}`);
  // });

  socket.on("disconnecting", (reason) => {
    try {
      console.log(
        `Disconnecting from rooms. ${reason}`,
        socket.rooms,
        socket.chatId
      );

      for (const room of socket.rooms) {
        if (room === socket.chatId) {
          //socket.to(room).emit("user has left", socket.id);
          socket.leave(socket.chatId);
        }
      }

      console.log(
        `Disconnected from rooms. ${reason}`,
        socket.rooms,
        socket.chatId
      );
    } catch (err) {
      console.error(`Failed to leave room while disconnecting.`);
    }
  });

  socket.on("chat", async (data) => {
    console.log("Received chat message", data, socket.chatId, socket.rooms);
    try {
      const addResponse = await MessageDAO.addMessage({
        chatId: data.chatId,
        type: "user",
        sender: data.sender,
        timestamp: data.timestamp,
        content: data.content,
      });

      console.log("Add response", addResponse);

      if (!addResponse.success) {
        throw new Error(`Failed to add message to DB. ${addResponse.error}`);
      }

      const message = await MessageDAO.getMessage(addResponse.id);

      console.log("Message socket chatId", socket.chatId, socket.rooms);

      io.in(socket.chatId).emit("chat", message);
    } catch (err) {
      console.error(`Failed to store message and resend it back to chat room.`);
    }
  });
});

httpServer.listen(port, () => {
  console.log(`Server running on port ${port}...`);
});
