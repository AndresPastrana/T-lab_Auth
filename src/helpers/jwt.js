const jwt = require("jsonwebtoken");

const validsTypes = {
  access_token: "access",
  refresh_token: "refresh",
};

const generateToken = (payload, type = "") => {
  if (!Object.values(validsTypes).includes(type)) {
    throw new Error("type argument is rquired");
  }

  return new Promise((resolve, reject) => {
    let options = {};
    let SECRET;

    if (type === "access") {
      SECRET = process.env.ACCESS_TOKEN_SECRET;
      options = {
        expiresIn: "30m",
      };
    }
    if (type === "refresh") {
      SECRET = process.env.REFRESH_TOKEN_SECRET;
    }
    jwt.sign(payload, SECRET, options, (error, token) => {
      if (error) return reject(error);
      return resolve(token);
    });
  });
};

module.exports = { generateToken };
