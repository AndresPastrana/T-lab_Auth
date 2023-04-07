require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const http = require("http");
const app = express();

// We pass the environment in what node is running
const moongose = require("./src/database").connection(app.get("env"));

// Middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(cors({ origin: "*", methods: ["POST", "GET"] }));
app.use(express.static("public"));

// Routes
app.use("/auth", require("./src/routes/credentials"));

// Server
const server = http.createServer(app);
server.on("listening", () => {
  console.log(
    `Server: Up and running on: http://localhost:${server.address().port}/`
  );
});

server.on("error", (error) => {
  console.log("Server Error");
  console.log(error);
});

server.listen(process.env.PORT || 22222);

// Process Handlers
process.on("SIGINT", () => {
  server.close(async () => {
    // Once the server has handle all the request
    await moongose.connection.close(false);
    process.exit(0);
  });
});

module.exports = {
  server,
  app,
};
