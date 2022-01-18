const sqlConnection = require("../services/sqlConnection");
const bcrypt = require("bcryptjs");
const auth = require("../util/auth");

module.exports = {
  signup: function (data, cb) {
    const userType = 2;
    let sql = `insert into Users (Username, Password, UserType, CreatedAt, UpdatedAt) values (?, ?, ${userType}, now(), now());`;

    const values = [];
    values.push(data.user_name);
    values.push(data.user_password);

    sqlConnection.executeQuery(sql, values, (err, result) => {
      cb(err, result);
    });
  },

  strongSignup: function (data, cb) {
    const userType = 2;
    let sql = `insert into Users (Username, Password, UserType, CreatedAt, UpdatedAt) values (?, ?, ${userType}, now(), now());`;

    const values = [];
    values.push(data.user_name);
    bcrypt.hash(data.user_password, 8, (err, hash) => {
      if (err) {
        console.log("Error in hashing password", err);
        return;
      }

      values.push(hash);

      sqlConnection.executeQuery(sql, values, (err, result) => {
        cb(err, result);
      });
    });
  },

  getUserSignupDetails: function (data, cb) {
    let sql = "select * from Users where Username = ?";
    let values = [];

    values.push(data.user_name);

    sqlConnection.executeQuery(sql, values, (err, result) => {
      cb(err, result);
    });
  },

  login: function (data, cb) {
    let sql = "select * from Users where Username = ? and Password = ?";
    let values = [];

    values.push(data.user_name);
    values.push(data.user_password);

    sqlConnection.executeQuery(sql, values, (err, result) => {
      cb(err, result);
    });
  },

  strongLogin: function (data, cb) {
    let sql = "select * from Users where Username = ?";
    let values = [];

    values.push(data.user_name);

    sqlConnection.executeQuery(sql, values, (err, result) => {
      const isValid = bcrypt.compareSync(
        data.user_password,
        result[0].Password
      );

      if (isValid) {
        const token = auth.newToken(result[0]);
        result.authToken = token;
        cb(err, result);
        return;
      }

      cb(err, []);
    });
  },

  getUserById: function (id, cb) {
    let sql = "select * from Users where ID = ?";
    const values = [];

    values.push(id);

    sqlConnection.executeQuery(sql, values, (err, result) => {
      cb(err, result);
    });
  },

  getUserDetails: function (id, cb) {
    let sql = "select * from UserDetails where UserID = ?";
    const values = [];
    values.push(id);

    sqlConnection.executeQuery(sql, values, (err, result) => {
      cb(err, result);
    });
  },

  registerDetails: function (data, cb) {
    let sql = `insert into UserDetails (UserID, Name, Email, Phone, Address, CreatedAt, UpdatedAt)
                 values
                 (?, ?, ?, ?, ?, now(), now())`;
    const values = [];
    values.push(data.user_id);
    values.push(data.user_originalName);
    values.push(data.user_email);
    values.push(data.user_phone);
    values.push(data.user_address);

    sqlConnection.executeQuery(sql, values, (err, result) => {
      cb(err, result);
    });
  },
};
