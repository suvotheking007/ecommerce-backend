const Product = require("../models/product");
const Config = require("../constants/backendConfig");

const codes = Config.httpCodes;

module.exports = {
  listProducts: function (req, res) {
    const data = req.body;
    const response = {
      success: false,
      msg: "The arguments given is not what is expected",
      status: codes.badRequest,
    };

    // ? -> Check if the request is valid or not
    if (data.category_id || data.min_price || data.max_price) {
      // success: As the request is valid

      Product.listProducts(data, (err, result) => {
        if (err) {
          response.status = codes.internalServerError;
          response.msg = `Failed to fetch products`;
          response.error = err;

          return res.status(response.status).send(response);
        }

        response.status = codes.success;
        response.msg = `Successfully listed products`;
        response.data = result;
        response.success = true;

        return res.status(response.status).send(response);
      });
    } else {
      // notSuccess: As the request is invalid

      return res.status(response.status).send(response);
    }
  },

  addProduct: function (req, res) {
    const data = req.body;
    const response = {
      success: false,
      msg: "The arguments given is not what is expected",
      status: codes.badRequest,
    };

    // ? -> Check if the request is valid or not
    if (
      data.name &&
      data.price &&
      data.description &&
      data.category_id &&
      data.vendor_id
    ) {
      // success: As the request is valid

      // # -> Go for adding the product
      Product.addProduct(data, (err, results) => {
        if (err) {
          response.status = codes.internalServerError;
          response.msg = `Unable to add the product`;
          response.error = err;

          return res.status(response.status).send(response);
        }

        response.status = codes.success;
        response.msg = `Successfully added the product`;
        response.data = results;
        response.success = true;

        return res.status(response.status).send(response);
      });
    } else {
      // notSuccess: As the request is invalid

      return res.status(response.status).send(response);
    }
  },
};
