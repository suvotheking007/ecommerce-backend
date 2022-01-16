const User = require("../models/user");
const auth = require("../util/auth");

module.exports = {
  signup: function (req, res) {
    let data = req.body;
    let response = {
      success: false,
      msg: "the parameters given is not what is expected",
      status: 400,
    };

    if (data.user_name && data.user_password) {
      User.getUserSignupDetails(data, (err, result) => {
        if (err) {
          response.msg = "Unable to get user signup details";
          response.status = 500;
          response.error = err;

          return res.status(response.status).send(response);
        }

        if (result.length > 0) {
          response.msg = "User already exist";
          response.status = 200;

          return res.status(response.status).send(response);
        }

        User.signup(data, (err, result) => {
          if (err) {
            response.msg = "Unable to sign up";
            response.status = 500;
            response.error = err;

            return res.status(response.status).send(response);
          }

          response.success = true;
          response.status = 200;
          response.msg = "Successfully signed up";
          response.data = result[0];

          return res.status(response.status).send(response);
        });
      });
    } else {
      return res.status(response.status).send(response);
    }
  },

  register: function (req, res) {
    let data = req.body;
    let response = {
      success: false,
      status: 401,
      msg: "the parameters given is not what is expected",
    };

    if (
      data.user_name &&
      data.user_originalName &&
      data.user_email &&
      data.user_phone &&
      data.user_address
    ) {
      User.getUserByName(data.user_name, (err, result1) => {
        if (result1.length == 0) {
          response.msg = `There is no user with the user name ${data.user_name}`;

          response.status = 500;

          return res.status(response.status).send(response);
        }

        if (err) {
          response.msg = "Unable to fetch user";

          return res.status(response.status).send(response);
        }

        data.user_id = result1[0].ID;

        User.registerDetails(data, (err, result2) => {
          if (err) {
            response.msg = "Unable to register user";

            return res.status(response.status).send(response);
          }

          response.success = true;
          response.msg = "Successfully registered all the details of the user";
          response.status = 200;
          response.data = { ...result1[0], ...result2[0] };

          return res.status(response.status).send(response);
        });
      });
    } else {
      return res.status(response.status).send(response);
    }
  },

  login: function (req, res) {
    let data = req.body;
    let response = {
      success: false,
      msg: "the parameters given is not what is expected",
      status: 400,
    };

    if (data.user_name && data.user_password) {
      User.strongLogin(data, (err, result) => {
        if (err) {
          response.msg = "Unable to log in";
          response.status = 500;
          response.error = err;

          return res.status(response.status).send(response);
        }

        if (result.length == 0) {
          response.msg = "Invalid username or password";
          response.status = 500;

          return res.status(response.status).send(response);
        }

        response.success = true;
        response.msg = "Successfully logged in";
        response.status = 200;
        response.data = {
          userName: result[0].Username,
          userId: result[0].ID,
        };
        if (result.authToken) {
          response.data.authToken = result.authToken;
        }

        return res.status(response.status).send(response);
      });
    } else {
      return res.status(response.status).send(response);
    }
  },

  getUserDetails: function (req, res) {
    let data = req.body;
    let response = {
      success: false,
      msg: "The parameters given is not what is expected",
      status: 401,
    };

    if (data.user_name) {
      User.getUserByName(data.user_name, (err, result1) => {
        if (err) {
          response.msg = "Unable to fetch users";
          response.status = 500;

          return res.status(response.status).send(response);
        }

        User.getUserDetails(result1[0].ID, (err, result2) => {
          if (err) {
            response.msg = `Unable to fetch the details of the user`;
            response.status = 500;

            return res.status(response.status).send(response);
          }

          response.success = true;
          response.msg = "Successfully fetched user details";
          response.status = 200;
          response.data = { ...result1[0], ...result2[0] };

          return res.status(response.status).send(response);
        });
      });
    } else {
      return res.status(response.status).send(response);
    }
  },

  isAuthenticated: function (req, res, next) {
    const token = req.headers.auth;
    let response;

    try {
      response = auth.verifyToken(token);
    } catch (err) {
      console.log(err);
      return res.status(401).send({ msg: "invalid token" });
    }

    User.getUserById(response.id, (err, result) => {
      let response;

      if (err) {
        response.msg = "Unable to fetch users";
        response.error = err;

        return res.status(401).send(response);
      }

      req.user = result;
      next();
    });
  },
};
