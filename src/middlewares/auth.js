const { request, response } = require("express");
const jwt = require("jsonwebtoken");

const isValidToken = (req = request, resp = response, next) => {
  const token = req.header("authorization").split(" ")[1];

  console.log(`Token: ${token}`);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, payload) => {
    if (error) return resp.status(401).json({ msg: "Unauthorized" });
    req.uid = payload.uid;
    next();
  });
};

module.exports = { isValidToken };
