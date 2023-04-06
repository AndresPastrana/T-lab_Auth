const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const { trydbConection } = require("./database/db");
const serverPaths = {
  auth: "/auth",
};

class Server {
  constructor() {
    this.serverPaths = serverPaths;
    this.app = express();
    this.applyAppMiddlewares();
    this.routes();
    this.startDBConnection();
    this.startListening();
  }

  startListening() {
    const PORT = process.env.PORT || 2400;
    this.app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}/`);
    });
  }

  applyAppMiddlewares() {
    this.app.use(express.json());
    this.app.use(morgan("tiny"));
    this.app.use(cors("*"));
    // this.app.use(express.static("public"));
  }

  routes() {
    this.app.use(this.serverPaths.auth, require("./routes/credentials"));
  }

  startDBConnection() {
    trydbConection();
  }
}

module.exports = Server;
