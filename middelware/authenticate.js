const jwt = require("jsonwebtoken"); // Correct the module name to "jsonwebtoken"
const User = require("../models/User"); // Correct the variable name to User
const authenticate = async (req, res, next) => {
  try {
    const authToken = req.header("Authorization").replace("Bearer ", "");
    const decodedToken = jwt.verify(authToken, "foo");

    if (decodedToken.exp && Date.now() >= decodedToken.exp * 1000) {
      throw new Error("Token has expired");
    }

    const user = await User.findOne({
      _id: decodedToken._id,
      "authTokens.authToken": authToken,
    });

    if (!user) {
      throw new Error("Authentication failed");
    }

    req.user = user;
    next();
  } catch (e) {
    res.status(401).json({ error: "Authentication failed" });
  }
};

module.exports = authenticate;
