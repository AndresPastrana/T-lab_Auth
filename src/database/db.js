const mongoose = require("mongoose");

const trydbConection = async () => {
  try {
    // Conection events handlers
    mongoose.connection.on("connecting", () => {
      console.log("DB : Starting connection....");
    });
    mongoose.connection.on("connected", () => {
      console.log("DB : Initial connection stablished .");
    });

    mongoose.connection.on("reconnected", () => {
      console.log("DB :  Connection re stablished .");
    });
    // mongoose.connection.on("disconnected", () => {
    //   console.error("DB : Database server's conection lost.");
    // });

    // mongoose.connection.on("open", () => {
    //   console.log("DB : Open");
    // });
    mongoose.connection.on("error", () => {
      console.error("Error conecting to the database");
    });

    // Initial conection
    await mongoose.connect(process.env.CDN_MONGODB, {
      autoCreate: true,
      bufferCommands: true,
    });
  } catch (error) {
    console.log("DB : Error on initial conection to the database server");
    console.log(error);
  }
};

module.exports = { trydbConection };
