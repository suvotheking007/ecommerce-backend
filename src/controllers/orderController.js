const Config = require("../constants/backendConfig");
const Order = require("../models/order");
const Product = require("../models/product");

const codes = Config.httpCodes;

module.exports = {
  getOrderDetails: function (req, res) {
    const data = req.body;
    const response = {
      success: false,
      msg: "The arguments given is not what is expected",
      status: codes.badRequest,
    };

    // ? -> Check if the request is valid or not
    if (data.user_id) {
      // success: As the request is valid

      // # -> Get the list of all the orders by this user
      Order.listOrderDetails(data, (err, orders) => {
        if (err) {
          response.status = codes.internalServerError;
          response.msg = `Unable to fetch the orders for the specified user`;
          response.error = err;

          return res.status(response.status).send(response);
        }

        response.status = codes.success;
        response.msg = `Successfully fetched the order details for the specified user`;
        response.data = orders;
        response.success = true;

        return res.status(response.status).send(response);
      });
    } else {
      // notSuccess: As the request is invalid

      return res.status(response.status).send(response);
    }
  },

  createOrder: function (req, res) {
    const data = req.body;
    const response = {
      success: false,
      msg: "The arguments given is not what is expected",
      status: codes.badRequest,
    };

    if (data.quantity == undefined) {
      data.quantity = 1;
    }

    // ? -> Check if the request is valid or not
    if (data.user_id && data.product_id) {
      // success: As the request is valid

      // # -> Look for the details of the product entered by the user
      Product.getProductDetails(data, (err, products) => {
        if (err) {
          response.status = codes.internalServerError;
          response.msg = `Unable to fetch the products`;
          response.error = err;

          return res.status(response.status).send(response);
        }

        const productPrice = Number(products[0].Price);

        // # -> Look for the previous pending order details (if any) for the current user
        Order.findOrderByUser(data, (err, orders) => {
          if (err) {
            response.status = codes.internalServerError;
            response.msg = `Unable to fetch the orders for the user`;
            response.error = err;

            return res.status(response.status).send(response);
          }

          // ? -> Check if the orders obtained from the database query is empty or not
          if (orders.length > 0) {
            // success: Since the orders obtained from database query is not empty move forward to edit the order

            const orderID = Number(orders[0].ID);
            const orderTotal = Number(orders[0].Total);

            data.total = orderTotal + data.quantity * productPrice;
            data.order_id = orderID;

            // # -> Edit the previous order
            Order.editOrder(data, (err, results) => {
              if (err) {
                response.status = codes.internalServerError;
                response.msg = `Unable to edit the order`;
                response.error = err;

                return res.status(response.status).send(response);
              }

              // # -> Add a new order item for the product_id
              Order.addOrderItem(data, (err, results) => {
                if (err) {
                  response.status = codes.internalServerError;
                  response.msg = `Unable to add the new order item`;
                  response.error = err;

                  return res.status(response.status).send(response);
                }

                response.status = codes.success;
                response.msg = `Successfully edited a previous order`;
                response.data = results;
                response.success = true;

                return res.status(response.status).send(response);
              });
            });
          } else {
            // notSuccess: Since the orders obtained from the database query is empty move forward to create a new order

            data.total = data.quantity * productPrice;

            // # -> Create a new order for the current user_id and total
            Order.addOrder(data, (err, orders) => {
              if (err) {
                response.status = codes.internalServerError;
                response.msg = `Unable to add a new order`;
                response.error = err;

                return res.status(response.status).send(response);
              }

              data.order_id = orders.insertId;

              // # -> Create a new order item for this order_id
              Order.addOrderItem(data, (err, results) => {
                if (err) {
                  response.status = codes.internalServerError;
                  response.msg = `Unable to add the new order item`;
                  response.error = err;

                  return res.status(response.status).send(response);
                }

                response.status = codes.success;
                response.msg = `Successfully created a new order`;
                response.data = results;
                response.success = true;

                return res.status(response.status).send(response);
              });
            });
          }
        });
      });
    } else {
      // notSuccess: As the request is invalid

      return res.status(response.status).send(response);
    }
  },

  editOrder: function (req, res) {
    const data = req.body;
    const response = {
      success: false,
      msg: "The arguments given is not what is expected",
      status: codes.badRequest,
    };

    // ? -> Check if the request is valid or not
    if (data.user_id && data.product_id && data.quantity) {
      // success: As the request is valid

      // # -> Look for the details of the order of the current user
      Order.getOrderDetails(data, (err, orders) => {
        if (err) {
          response.status = codes.internalServerError;
          response.msg = `Unable to fetch the order of the user`;
          response.error = err;

          return res.status(response.status).send(response);
        }

        const orderTotal = Number(orders[0].Total);
        const orderID = Number(orders[0].ID);

        data.order_id = orderID;

        // # -> Look for the product details that corresponds to this order id and product id
        Order.getOrderProduct(data, (err, products) => {
          if (err) {
            response.status = codes.internalServerError;
            response.msg = `unable to fetch the product`;
            response.error = err;

            return res.status(response.status).send(response);
          }

          const productQuantity = Number(products[0].Quantity);
          const productPrice = Number(products[0].Price);

          /** Calculation of the total and storing it in the "data" object */
          {
            const oldProductTotal = productQuantity * productPrice;
            const newProductTotal = data.quantity * productPrice;

            data.total = orderTotal;
            data.total -= oldProductTotal;
            data.total += newProductTotal;

            // # -> Go for editing the order details
            Order.editOrder(data, (err, results) => {
              if (err) {
                response.status = codes.internalServerError;
                response.msg = `Unable to edit the order`;
                response.error = err;

                return res.status(response.status).send(response);
              }

              // # -> Finally edit the order item
              Order.editOrderItem(data, (err, results) => {
                if (err) {
                  response.status = codes.internalServerError;
                  response.msg = `Unable to edit the order item`;
                  response.error = err;

                  return res.status(response.status).send(response);
                }

                response.status = codes.success;
                response.msg = `Successfully edited the order`;
                response.data = results;
                response.success = true;

                return res.status(response.status).send(response);
              });
            });
          }
        });
      });
    } else {
      // notSuccess: As the request is invalid

      return res.status(response.status).send(response);
    }
  },
};
