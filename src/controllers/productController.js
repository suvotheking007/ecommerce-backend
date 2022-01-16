const Product = require("../models/product");

module.exports = {
  listProducts: function (req, res) {
    let data = req.body;
    Product.listProducts(data, (err, result) => {
      if (err) {
        return res.send({
          success: false,
          msg: "Failed to fetch products",
          status: 500,
        });
      }

      return res.send({
        success: true,
        msg: "Successfully fetched products",
        status: 200,
        products: result,
      });
    });
  },

  addProduct: function (req, res) {
    let data = req.body;
    if (
      data.name &&
      data.price &&
      data.description &&
      data.categoryId &&
      data.vendorId
    ) {
      Product.addProduct(data, (err, result) => {
        if (err) {
          return res.send({
            success: false,
            msg: "Failed to add the product",
            status: 500,
          });
        }

        return res.send({
          success: true,
          msg: "Product added successfully",
          status: 200,
          products: result,
        });
      });
    } else {
      return res.send({ message: "Please enter all the fields" });
    }
  },
};
