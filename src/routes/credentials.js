const { Router, request } = require("express");
const { body, param, query } = require("express-validator");
const jwt = require("jsonwebtoken");

const {
  login,
  register,
  refresh,
  logout,
} = require("../controller/credentials");
const { isValidToken, isValidRole } = require("../middlewares/auth");

// TODO: export all middlewares from an index file
const { existCredentials } = require("../middlewares/db-validators");
const { validate } = require("../middlewares/validate");
const router = new Router();

router.post(
  "/register",
  [
    body("email", "Invalid emial").isEmail(),
    body("password", "weak password").isStrongPassword(),
    body("email", "This user alredy exist").custom(existCredentials),
    body("role", "role is required").notEmpty(),
    body("role", "invalid role").custom(isValidRole),
    validate,
  ],
  register
);
router.post(
  "/login",
  [
    body("email", "Invalid emial").isEmail(),
    body("password", "Password is required").notEmpty(),
    validate,
  ],
  login
);
router.get("/refresh", [isValidToken("refresh")], refresh);


// Verify is Its a valid token and if the user is the role that it needs to Be
router.get('/access', [
  query('access_token', 'access_token is required').notEmpty(),
  query('role', 'role is required').notEmpty(),
  query('role', 'invalid role format , [string]').isString(),
  query('role', 'invalid role').custom(isValidRole),
  validate

], async (req = request, resp) => {
  const { access_token, role } = req.query;

  jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET, (error, payload) => {

    if (error) {
      return resp.status(401).json({
        error: "Unauthorized , invalid token"
      });
    }
    console.log(payload);
    const { role: user_role } = payload;

    // Check the sended role with the real user role  
    if (user_role !== role) {
      return resp.status(401).json({
        error: "Unauthorized , lack of privileges"
      })
    }
    return resp.json({ scucces: true });
  });

  // TODO: verify token


  // TODO verify role
})

router.delete("/logout", [isValidToken("refresh")], logout);

module.exports = router;
