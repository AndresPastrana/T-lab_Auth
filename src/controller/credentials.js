const { request, response } = require("express");
const bcrypt = require("bcrypt");
const { Types } = require("mongoose");

const CredentialsModel = require("../models/Credentials");
const { generateToken } = require("../helpers/jwt");

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
    const payload = { uid: cred._id.toString(),role: cred.role };
    const access_token = await generateToken(payload);
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
  try {
    const { email, password, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const cred = new CredentialsModel({ email, password: hashedPassword, role });
    const payload = { uid: cred._id.toString(), role };

    const [access_token, refresh_token] = await Promise.all([
      await generateToken(payload),
      await generateToken(payload, "refresh"),
    ]);

    cred.refreshToken = refresh_token;

    const user = await cred.save();

    return resp.json({
      access_token,
      refresh_token: user.refreshToken,
    });
  } catch (error) {
    console.log(error);
    return resp.status(500).json({ error });
  }
};

const refresh = async (req = request, resp = response) => {
  try {
    const { uid } = req;
    const query = { active: true, _id: uid };
    // Find for the user , with that _id
    const cred = await CredentialsModel.findOne(query);

    // The user was deleted
    if (!cred) {
      return resp.status(404).json({ msg: "Recurso no encontrado" });
    }
    // Generate new access_token
    const payload = { uid: cred._id.toString() };
    const access_token = await generateToken(payload);
    return resp.json({ access_token, refresh_token: cred.refreshToken });
  } catch (error) {
    console.log(error);
    return resp.json({ error });
  }
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

const access = (req, resp) => {
  const { access_token, role } = req.query;
  try {
    jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET, async (error, payload) => {
       
      // Check for an  jwt error
      if (error) {
        return resp.status(401).json({
          error: "Unauthorized , invalid token"
        });
      }

      // Check the sended role with the real user role  
      const { uid } = payload;
      const userRole = await CredentialsModel.findById(new Types.ObjectId(uid));
      if (userRole !== role) {
        return resp.status(401).json({
          error: "Unauthorized , lack of privileges"
        })
      }


      // Everything went okf
      return resp.json({ scucces: true });
    });
  } catch (error) {
    return resp.status(500).json({
      error: error.message
    })
  }

}
module.exports = {
  login,
  register,
  refresh,
  logout,
  access
};
