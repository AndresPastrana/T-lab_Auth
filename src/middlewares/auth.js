const jwt = require("jsonwebtoken");
const { request, response } = require("express");
const { Types } = require("mongoose");

const allowedRoles = ['admin', 'student', 'profesor']

const isValidToken = (type = "access") => {
  return (req = request, resp = response, next) => {
    const SECRET =
      type === "refresh"
        ? process.env.REFRESH_TOKEN_SECRET
        : process.env.ACCESS_TOKEN_SECRET;

    const token = req.header("authorization").split(" ")[1];
    jwt.verify(token, SECRET, (error, payload) => {
      if (error) return resp.status(401).json({ msg: "Unauthorized" });
      req.uid = new Types.ObjectId(payload.uid);
      next();
    });
  };
};


const isValidRole = (role) => {
  console.log(role);
  if (!allowedRoles.includes(role)) {
    return false
  }

  return true

}
module.exports = { isValidToken, isValidRole };
