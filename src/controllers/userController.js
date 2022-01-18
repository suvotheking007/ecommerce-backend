const User = require("../models/user");
const auth = require("../util/auth");
const Config = require("../constants/backendConfig");

const codes = Config.httpCodes;

module.exports = {
  signup: function (req, res) {
    const data = req.body;
    const response = {
      success: false,
      msg: "The arguments given is not what is expected",
      status: codes.badRequest,
    };

    // ? -> Check if the request is valid or not
    if (data.user_name && data.user_password) {
      // success: As the request is valid

      // # -> Look for the user signup details
      User.getUserSignupDetails(data, (err, details) => {
        if (err) {
          response.status = codes.internalServerError;
          response.msg = `Unable to get user signup details`;
          response.error = err;

          return res.status(response.status).send(response);
        }

        // ? -> Check if the user details that is fetched is empty or not
        {
          if (details.length == 0) {
            // success: Since the details fetched is empty, go for signing up the user

            // # -> Going to signup the user
            User.signup(data, (err, results) => {
              if (err) {
                response.status = codes.internalServerError;
                response.msg = `Unable to sign up`;
                response.error = err;

                return res.status(response.status).send(response);
              }

              response.status = codes.success;
              response.msg = `Successfully signed up`;
              response.data = results;
              response.success = true;

              return res.status(response.status).send(response);
            });
          } else {
            // notSuccess: Since the details fetched is not empty, the user is already signed up

            response.status = codes.success;
            response.msg = `User already exist`;
            response.data = details;
            response.success = true;

            return res.status(response.status).send(response);
          }
        }
      });
    } else {
      // notSuccess: As the request is invalid

      return res.status(response.status).send(response);
    }
  },

  register: function (req, res) {
    const data = req.body;
    const response = {
      success: false,
      msg: "The arguments given is not what is expected",
      status: codes.badRequest,
    };

    // ? -> Check if the request is valid or not
    if (
      data.user_name &&
      data.user_originalName &&
      data.user_email &&
      data.user_phone &&
      data.user_address
    ) {
      // success: As the request is valid

      // # -> Look for fetching the details for the user with the given name
      User.getUserSignupDetails(data, (err, details) => {
        if (err) {
          response.status = codes.internalServerError;
          response.msg = `Unable to get user signup details`;
          response.error = err;

          return res.status(response.status).send(response);
        }

        // ? -> Check if the details fetched for the user is non empty or not
        {
          if (details.length > 0) {
            // success: The user is already signed up so go ahead for registering his or her details

            data.user_id = details[0].ID;

            // # -> Go for registering the details
            User.registerDetails(data, (err, results) => {
              if (err) {
                response.status = codes.internalServerError;
                response.msg = `Unable to register user`;
                response.error = err;

                return res.status(response.status).send(response);
              }

              response.status = codes.success;
              response.msg = `Successfully registered all the details of the user`;
              response.data = results;
              response.success = true;

              return res.status(response.status).send(response);
            });
          } else {
            // notSuccess: The user is not signed up so he or she cannot go for registering the details

            response.status = codes.success;
            response.msg = `User is not signed up yet`;
            response.data = details;
            response.success = true;

            return res.status(response.status).send(response);
          }
        }
      });
    } else {
      // notSuccess: As the request is invalid

      return res.status(response.status).send(response);
    }
  },

  login: function (req, res) {
    const data = req.body;
    const response = {
      success: false,
      msg: "The arguments given is not what is expected",
      status: codes.badRequest,
    };

    // ? -> Check if the request is valid or not
    if (data.user_name && data.user_password) {
      // success: As the request is valid

      // # -> Go for logging the user
      User.login(data, (err, loginDetails) => {
        if (err) {
          response.status = codes.internalServerError;
          response.msg = `Unable to log in`;
          response.error = err;

          return res.status(response.status).send(response);
        }

        // ? -> Check if the login details is empty or not for verifying if the password entered by the user is valid or not
        {
          if (loginDetails.length > 0) {
            // success: Login details is not empty that means that the user has entered a correct password and thus can be logged in

            response.status = codes.success;
            response.msg = `Successfully logged in`;
            response.data = loginDetails;
            response.success = true;

            return res.status(response.status).send(response);
          } else {
            // notSuccess: Login details is empty that means that the user has entered an incorrect password and thus cannot be logged in

            response.status = codes.success;
            response.msg = `Invalid username or password`;
            response.data = loginDetails;
            response.success = true;

            return res.status(response.status).send(response);
          }
        }
      });
    } else {
      // notSuccess: As the request is invalid

      return res.status(response.status).send(response);
    }
  },
};
