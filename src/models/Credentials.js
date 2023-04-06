// This collecion will have the user's credentials like email and password
// And also the uid that belongs this credentials

// uid Type ObjectId
// email String
// password hashed password

const { Schema, model } = require("mongoose");

const CredentialsSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
    default: null,
    unique: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  isConfrimed: {
    type: Boolean,
    default: false,
  },
});

const CredentialsModel = model("Credential", CredentialsSchema);

CredentialsSchema.methods.toJSON = function () {
  // We should never return the password and the email of the user
  const { __v, _id, password, email } = this.toObject();
  return { uid: _id };
};

module.exports = CredentialsModel;
