const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userShema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "enter your name"],
  },
  username: {
    type: String,
    required: [true, "enter your username"],
  },
  lastname: {
    type: String,
    required: [true, "enter your lastname"],
  },
  email: {
    type: String,
    required: [true, "enter your email"],
  },
  password: {
    type: String,
    required: [true, "enter your password"],
  },
  role: {
    type: String,
    default: "USER", // Set the default role to "USER"
  },
  authTokens: [
    {
      authToken: {
        type: String,
        required: true,
      },
    },
  ],
  image: {
    type: String,
  },
  contentType: {
    type: String,
  },

  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Products",
  },
});

userShema.methods.generateAuthAndSaveToken = async function () {
  const expireIn = "24h"; // Expire token in 24 hours
  const expireTime = new Date(Date.now() + 24 * 60 * 60 * 1000); // Calculate expiration time for 24 hours
  const authToken = jwt.sign({ _id: this._id.toString() }, "foo", {
    expiresIn: expireIn,
  });
  this.authTokens.push({ authToken, expiresAt: expireTime });
  await this.save();
  return authToken;
};

userShema.statics.findUser = async (email, password) => {
  const User = await user.findOne({ email, password });
  if (!User) throw new Error("error, no connection");
  return User;
};

const user = mongoose.model("Users", userShema);
module.exports = user;
