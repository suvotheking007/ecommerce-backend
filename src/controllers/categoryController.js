const Category = require("../models/category");

module.exports = {
  listCategories: function (req, res) {
    Category.listCategories((err, result) => {
      if (err) {
        return res.send({
          msg: "Error in fetching categories",
          success: false,
          status: 500,
        });
      }

      return res.send({
        msg: "Successfully fetched categories",
        success: true,
        status: 200,
        categories: result,
      });
    });
  },
};
