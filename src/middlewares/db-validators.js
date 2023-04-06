const CredentialsModel = require("../models/Credentials");

const existCredentials = async (email = "") => {
  const cred = await CredentialsModel.findOne({ email });
  if (cred) {
    throw new Error("This user alredy exist");
  }
};
module.exports = { existCredentials };
