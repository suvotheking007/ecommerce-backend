const sqlConnection = require("../services/sqlConnection");

module.exports = {
  listCategories: function (cb) {
    // cb is representing the functionality of the caller
    let sql = "select ID as categoryId, Name as name from Categories;";

    const values = [];

    sqlConnection.executeQuery(sql, values, (err, result) => {
      cb(err, result);
    });
  },
};
