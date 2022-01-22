const Category = require("../models/category");
const Config = require("../constants/backendConfig");

const codes = Config.httpCodes;

module.exports = {
  listCategories: function (req, res) {
    const data = req.body;
    const response = {
      success: false,
    };

    // # -> Go for fetching all the categories that are available in the database
    Category.listCategories((err, categories) => {
      if (err) {
        response.status = codes.internalServerError;
        response.msg = `Unable to fetch categories`;
        response.error = err;

        return res.status(response.status).send(response);
      }

      response.status = codes.success;
      response.msg = `Successfully fetched categories`;
      response.data = categories;
      response.success = true;

      return res.status(response.status).send(response);
    });
  },
};
