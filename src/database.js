const mongoose = require("mongoose");

const connection = (env) => {
  let CDN;
  if (env === "development") {
    CDN = process.env.CDN_MONGODB_DEV;
  }

  if (env === "test") {
    CDN = process.env.CDN_MONGODB_TEST;
  }

  // Define here conection events handlers
  if (env !== "test") {
    mongoose.connection.once("open", () => {
      console.log(`DB :  Database online   (${env})`);
    });

    mongoose.connection.once("disconnected", () => {
      console.log(`\n DB :  Database offline   (${env})`);
    });
  }

  // mongoose.connection.once("disconnected", () => {
  //   console.log("DB :  Mongoose conection disconected .");
  // });

  mongoose.connection.on("error", () => {
    console.error("Error conecting to the database");
  });

  // Initial conection
  mongoose.connect(CDN, {
    autoCreate: true,
    bufferCommands: true,
  });

  return mongoose;
};

module.exports = { connection };
