const { request, response } = require("express");
const bcrypt = require("bcrypt");

const CredentialsModel = require("../models/Credentials");
const { generateToken } = require("../helpers/jwt");

// Autentica el usuario en el sitema , genera u token de acceso y un token de refresh
const login = async (req = request, resp = response) => {
  try {
    const { email = "", password = "" } = req.body;

    const query = { email, active: true };

    // Verificamos que exista un usario con estas credentiales
    const cred = await CredentialsModel.findOne(query);

    // Check if the credentials exist
    if (!cred) {
      return resp.status(400).json({ msg: "Wrong email or password " });
    }

    const isRightPassword = await bcrypt.compare(password, cred.password);

    // We check if the password is correct
    if (!isRightPassword) {
      return resp.status(400).json({ msg: "Wrong email or password " });
    }

    // Access token
    const payload = { uid: cred._id };
    const access_token = await generateToken(payload, "access");

    // Refresh token
    if (!cred.refreshToken) {
      cred.refreshToken = await generateToken(payload, "refresh");
      await cred.save();
    }

    return resp.json({
      access_token,
      refresh_token: cred.refreshToken,
    });
  } catch (error) {
    console.log(error);
    return resp.status(500).json({
      error,
    });
  }
};

const register = async (req = request, resp = response) => {
  const { email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const cred = new CredentialsModel({ email, password: hashedPassword });

  const payload = { uid: cred._id };

  const [access_token, refresh_token] = await Promise.all([
    await generateToken(payload, "access"),
    await generateToken(payload, "refresh"),
  ]);

  cred.refreshToken = refresh_token;

  const user = await cred.save();

  return resp.json({
    access_token,
    refresh_token: user.refreshToken,
  });
};

const refresh = async (req = request, resp = response) => {
  // TODO:
  // Extract the uid from the request
  const { uid } = req;
  const query = { active: true, _id: uid };
  // Find for the user , with that _id
  const cred = await CredentialsModel.findOne(query);

  if (!cred) {
  }
  // Generate new access_token
  const access_token = await generateToken(
    {
      uid: cred._id,
      isConfirmed: cred.isConfirmed,
    },
    "access"
  );

  return resp.json({ access_token, refresh_token: cred.refreshToken });
};

const logout = async (req = request, resp = response) => {
  try {
    const { uid } = req;
    const query = { _id: uid, active: true };
    const cred = await CredentialsModel.findOne(query);
    if (!cred) {
      return resp.status(403).json({ msg: "Invalid uid" });
    }
    cred.refreshToken = null;
    await cred.save();

    return resp.status(201).json({ ok: true });
  } catch (error) {
    console.log(error);
    return resp.status(500).json({
      error,
    });
  }
};
module.exports = {
  login,
  register,
  refresh,
  logout,
};
