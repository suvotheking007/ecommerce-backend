const jwt = require("jsonwebtoken");

module.exports = {
  newToken: function (user) {
    return jwt.sign({ id: user.ID }, "relevel", { expiresIn: "10d" });
  },

  verifyToken: function (token) {
    try {
      let response = jwt.verify(token, "relevel");
      return response;
    } catch (err) {
      console.log(err);
      return;
    }
  },
};
