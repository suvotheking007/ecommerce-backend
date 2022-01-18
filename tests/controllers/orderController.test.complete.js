const orderController = require("../../src/controllers/orderController");
const orderModel = require("../../src/models/order");
const productModel = require("../../src/models/product");
const Payload = require("../payload.js");
const Config = require("../../src/constants/backendConfig");
const Mock = require("../mocker");

const jestMock = require("jest-mock");
const codes = Config.httpCodes;

describe(`test getOrderDetails`, () => {
  //<> test getOrderDetails

  describe(`check request validity`, () => {
    //<> check request validity

    test(`request is invalid`, async () => {
      const req = Mock.mockRequest();
      const res = Mock.mockResponse();

      const listOrderDetailsSpy = jestMock.spyOn(
        orderModel,
        "listOrderDetails"
      );
      await orderController.getOrderDetails(req, res);

      expect(listOrderDetailsSpy).toHaveBeenCalledTimes(0);
      expect(res.status).toHaveBeenCalledWith(codes.badRequest);
      expect(res.send).toHaveBeenCalledWith({
        success: false,
        msg: `The arguments given is not what is expected`,
        status: codes.badRequest,
      });
    });

    describe(`request is valid`, () => {
      //<> request is valid

      test(`error in fetching order details`, async () => {
        const req = Mock.mockRequest();
        const res = Mock.mockResponse();

        req.body.user_id = true;

        const err = new Error("a simple error");

        const listOrderDetailsSpy = jestMock
          .spyOn(orderModel, "listOrderDetails")
          .mockImplementation((data, cb) => {
            cb(err, null);
          });

        await orderController.getOrderDetails(req, res);

        expect(listOrderDetailsSpy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(codes.internalServerError);
        expect(res.send).toHaveBeenCalledWith({
          success: false,
          status: codes.internalServerError,
          msg: `Unable to fetch the orders for the specified user`,
          error: err,
        });
      });

      describe(`successfully fetched order details`, () => {
        //<> successfully fetched order details

        test(`list order details`, async () => {
          const req = Mock.mockRequest();
          const res = Mock.mockResponse();

          req.body.user_id = true;

          const listOrderDetailsSpy = jestMock
            .spyOn(orderModel, "listOrderDetails")
            .mockImplementation((data, cb) => {
              cb(null, Payload.controller);
            });

          await orderController.getOrderDetails(req, res);
          expect(listOrderDetailsSpy).toHaveBeenCalled();
          expect(res.status).toHaveBeenCalledWith(codes.success);
          expect(res.send).toHaveBeenCalledWith({
            success: true,
            msg: `Successfully fetched the order details for the specified user`,
            status: codes.success,
            data: Payload.controller,
          });
        });
      });
    });
  });
});

describe("test createOrder", () => {
  // <> test createOrder

  describe("check request validity", () => {
    // <> check request validity

    test("request invalid", async () => {
      const req = Mock.mockRequest();
      const res = Mock.mockResponse();

      const spy = jestMock
        .spyOn(productModel, "getProductDetails")
        .mockImplementation((data, cb) => {
          cb(null, Payload.controller);
        });

      await orderController.createOrder(req, res);

      expect(spy).toHaveBeenCalledTimes(0);
      expect(res.status).toHaveBeenCalledWith(codes.badRequest);
      expect(res.send).toHaveBeenCalledWith({
        success: false,
        msg: "The arguments given is not what is expected",
        status: codes.badRequest,
      });
    });

    describe("request is valid", () => {
      // <> request is valid

      test("error in fetching product details", async () => {
        const req = Mock.mockRequest();
        const res = Mock.mockResponse();

        req.body = {
          user_id: 1,
          product_id: 1,
        };

        const err = new Error("a simple error");

        const productSpy = jestMock
          .spyOn(productModel, "getProductDetails")
          .mockImplementation((data, cb) => {
            cb(null, Payload.controller);
          });

        const orderSpy = jestMock
          .spyOn(orderModel, "findOrderByUser")
          .mockImplementation((data, cb) => {
            cb(err, null);
          });

        await orderController.createOrder(req, res);

        expect(productSpy).toHaveBeenCalled();
        expect(orderSpy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(codes.internalServerError);
        expect(res.send).toHaveBeenCalledWith({
          success: false,
          status: codes.internalServerError,
          msg: `Unable to fetch the orders for the user`,
          error: err,
        });
      });

      describe("successfully fetched product details", () => {
        // <> successfully fetched product details

        test(`error in fetching order details`, async () => {
          const req = Mock.mockRequest();
          const res = Mock.mockResponse();

          req.body = {
            user_id: 1,
            product_id: 1,
          };

          const err = new Error("a simple error");

          const productSpy = jestMock
            .spyOn(productModel, "getProductDetails")
            .mockImplementation((data, cb) => {
              cb(null, Payload.controller);
            });

          const orderSpy = jestMock
            .spyOn(orderModel, "findOrderByUser")
            .mockImplementation((data, cb) => {
              cb(err, null);
            });

          await orderController.createOrder(req, res);

          expect(productSpy).toHaveBeenCalled();
          expect(orderSpy).toHaveBeenCalled();
          expect(res.status).toHaveBeenCalledWith(codes.internalServerError);
          expect(res.send).toHaveBeenCalledWith({
            success: false,
            status: codes.internalServerError,
            msg: `Unable to fetch the orders for the user`,
            error: err,
          });
        });

        describe(`fetched empty order details`, () => {
          //<> fetched empty order details

          test(`error in adding a new order`, async () => {
            const req = Mock.mockRequest();
            const res = Mock.mockResponse();

            req.body = {
              total: 1,
              user_id: 1,
              product_id: 1,
              quantity: 1,
            };

            const err = new Error("a simple error");

            const getProductDetailsSpy = jestMock
              .spyOn(productModel, "getProductDetails")
              .mockImplementation((data, cb) => {
                cb(null, Payload.controller);
              });

            const findOrderByUserSpy = jestMock
              .spyOn(orderModel, "findOrderByUser")
              .mockImplementation((data, cb) => {
                cb(null, Payload.empty);
              });

            const addOrderSpy = jestMock
              .spyOn(orderModel, "addOrder")
              .mockImplementation((data, cb) => {
                cb(err, null);
              });

            await orderController.createOrder(req, res);

            expect(getProductDetailsSpy).toHaveBeenCalled();
            expect(findOrderByUserSpy).toHaveBeenCalled();
            expect(addOrderSpy).toHaveBeenCalled();

            expect(res.status).toHaveBeenCalledWith(codes.internalServerError);
            expect(res.send).toHaveBeenCalledWith({
              success: false,
              status: codes.internalServerError,
              msg: `Unable to add a new order`,
              error: err,
            });
          });

          describe(`Successfully added a new order`, () => {
            //<> Successfully added a new order

            test(`Error in adding a new order item`, async () => {
              const req = Mock.mockRequest();
              const res = Mock.mockResponse();

              req.body = {
                total: 1,
                user_id: 1,
                product_id: 1,
                quantity: 1,
              };

              const err = new Error("a simple error");

              const getProductDetailsSpy = jestMock
                .spyOn(productModel, "getProductDetails")
                .mockImplementation((data, cb) => {
                  cb(null, Payload.controller);
                });

              const findOrderByUserSpy = jestMock
                .spyOn(orderModel, "findOrderByUser")
                .mockImplementation((data, cb) => {
                  cb(null, Payload.empty);
                });

              const addOrderSpy = jestMock
                .spyOn(orderModel, "addOrder")
                .mockImplementation((data, cb) => {
                  cb(null, Payload.controller);
                });

              const addOrderItemSpy = jestMock
                .spyOn(orderModel, "addOrderItem")
                .mockImplementation((data, cb) => {
                  cb(err, null);
                });

              await orderController.createOrder(req, res);

              expect(getProductDetailsSpy).toHaveBeenCalled();
              expect(findOrderByUserSpy).toHaveBeenCalled();
              expect(addOrderSpy).toHaveBeenCalled();
              expect(addOrderItemSpy).toHaveBeenCalled();

              expect(res.status).toHaveBeenCalledWith(
                codes.internalServerError
              );
              expect(res.send).toHaveBeenCalledWith({
                success: false,
                status: codes.internalServerError,
                msg: `Unable to add the new order item`,
                error: err,
              });
            });

            describe(`Successfully added a new order item`, () => {
              //<> Successfully added a new order item

              test(`Successfully created a new order`, async () => {
                const req = Mock.mockRequest();
                const res = Mock.mockResponse();

                req.body = {
                  user_id: 1,
                  product_id: 1,
                  total: 1,
                  quantity: 1,
                  order_id: 1,
                };

                const productSpy = jestMock
                  .spyOn(productModel, "getProductDetails")
                  .mockImplementation((data, cb) => {
                    cb(null, Payload.controller);
                  });

                const findOrderSpy = jestMock
                  .spyOn(orderModel, "findOrderByUser")
                  .mockImplementation((data, cb) => {
                    cb(null, Payload.empty);
                  });

                const addOrderSpy = jestMock
                  .spyOn(orderModel, "addOrder")
                  .mockImplementation((data, cb) => {
                    cb(null, Payload.controller);
                  });

                const addOrderItemSpy = jestMock
                  .spyOn(orderModel, "addOrderItem")
                  .mockImplementation((data, cb) => {
                    cb(null, Payload.controller);
                  });

                await orderController.createOrder(req, res);

                expect(productSpy).toHaveBeenCalled();
                expect(findOrderSpy).toHaveBeenCalled();
                expect(addOrderSpy).toHaveBeenCalled();
                expect(addOrderItemSpy).toHaveBeenCalled();
                expect(res.status).toHaveBeenCalledWith(200);
                expect(res.send).toHaveBeenCalledWith({
                  success: true,
                  msg: `Successfully created a new order`,
                  status: codes.success,
                  data: Payload.controller,
                });
              });
            });
          });
        });

        describe(`fetched non empty order details`, () => {
          //<> fetched non empty order details

          test(`error in editing the previous order`, async () => {
            const req = Mock.mockRequest();
            const res = Mock.mockResponse();

            req.body = {
              user_id: 1,
              product_id: 1,
              total: 1,
              quantity: 1,
              order_id: 1,
            };

            const err = new Error("a simple error");

            const getProductDetailsSpy = jestMock
              .spyOn(productModel, "getProductDetails")
              .mockImplementation((data, cb) => {
                cb(null, Payload.controller);
              });

            const findOrderByUserSpy = jestMock
              .spyOn(orderModel, "findOrderByUser")
              .mockImplementation((data, cb) => {
                cb(null, Payload.controller);
              });

            const editOrderSpy = jestMock
              .spyOn(orderModel, "editOrder")
              .mockImplementation((data, cb) => {
                cb(err, null);
              });

            await orderController.createOrder(req, res);
            expect(getProductDetailsSpy).toHaveBeenCalled();
            expect(findOrderByUserSpy).toHaveBeenCalled();
            expect(editOrderSpy).toHaveBeenCalled();

            expect(res.status).toHaveBeenCalledWith(codes.internalServerError);
            expect(res.send).toHaveBeenCalledWith({
              success: false,
              status: codes.internalServerError,
              msg: `Unable to edit the order`,
              error: err,
            });
          });

          describe(`successfully edited the previous order`, () => {
            //<> successfully edited the previous order

            test(`error in adding a new order item`, async () => {
              const req = Mock.mockRequest();
              const res = Mock.mockResponse();

              req.body = {
                user_id: 1,
                product_id: 1,
                total: 1,
                quantity: 1,
                order_id: 1,
              };

              const err = new Error("a simple error");

              const getProductDetailsSpy = jestMock
                .spyOn(productModel, "getProductDetails")
                .mockImplementation((data, cb) => {
                  cb(null, Payload.controller);
                });

              const findOrderByUserSpy = jestMock
                .spyOn(orderModel, "findOrderByUser")
                .mockImplementation((data, cb) => {
                  cb(null, Payload.controller);
                });

              const editOrderSpy = jestMock
                .spyOn(orderModel, "editOrder")
                .mockImplementation((data, cb) => {
                  cb(null, err);
                });

              const addOrderItemSpy = jestMock
                .spyOn(orderModel, "addOrderItem")
                .mockImplementation((data, cb) => {
                  cb(err, null);
                });

              await orderController.createOrder(req, res);
              expect(getProductDetailsSpy).toHaveBeenCalled();
              expect(findOrderByUserSpy).toHaveBeenCalled();
              expect(editOrderSpy).toHaveBeenCalled();
              expect(addOrderItemSpy).toHaveBeenCalled();

              expect(res.status).toHaveBeenCalledWith(
                codes.internalServerError
              );
              expect(res.send).toHaveBeenCalledWith({
                success: false,
                status: codes.internalServerError,
                msg: `Unable to add the new order item`,
                error: err,
              });
            });

            describe(`successfully added a new order item`, () => {
              //<> successfully added a new order item

              test(`successfully created a new order`, async () => {
                const req = Mock.mockRequest();
                const res = Mock.mockResponse();

                req.body = {
                  user_id: 1,
                  product_id: 1,
                  total: 1,
                  quantity: 1,
                  order_id: 1,
                };

                const productSpy = jestMock
                  .spyOn(productModel, "getProductDetails")
                  .mockImplementation((data, cb) => {
                    cb(null, Payload.controller);
                  });

                const findOrderSpy = jestMock
                  .spyOn(orderModel, "findOrderByUser")
                  .mockImplementation((data, cb) => {
                    cb(null, Payload.controller);
                  });

                const editOrderSpy = jestMock
                  .spyOn(orderModel, "editOrder")
                  .mockImplementation((data, cb) => {
                    cb(null, Payload.controller);
                  });

                const addOrderItemSpy = jestMock
                  .spyOn(orderModel, "addOrderItem")
                  .mockImplementation((data, cb) => {
                    cb(null, Payload.controller);
                  });

                await orderController.createOrder(req, res);
                expect(productSpy).toHaveBeenCalled();
                expect(findOrderSpy).toHaveBeenCalled();
                expect(editOrderSpy).toHaveBeenCalled();
                expect(addOrderItemSpy).toHaveBeenCalled();
                expect(res.status).toHaveBeenCalledWith(codes.success);
                expect(res.send).toHaveBeenCalledWith({
                  success: true,
                  msg: `Successfully edited a previous order`,
                  status: codes.success,
                  data: Payload.controller,
                });
              });
            });
          });
        });
      });
    });
  });
});

describe(`test editOrder`, () => {
  //<> test editOrder

  describe(`check request validity`, () => {
    //<> check request validity

    test(`request is invalid`, async () => {
      const req = Mock.mockRequest();
      const res = Mock.mockResponse();

      const getOrderDetailsSpy = jestMock.spyOn(orderModel, "getOrderDetails");

      await orderController.editOrder(req, res);
      expect(getOrderDetailsSpy).toHaveBeenCalledTimes(0);
      expect(res.status).toHaveBeenCalledWith(codes.badRequest);
      expect(res.send).toHaveBeenCalledWith({
        success: false,
        msg: `The arguments given is not what is expected`,
        status: codes.badRequest,
      });
    });

    describe(`request is valid`, () => {
      //<> request is valid

      describe(`try to fetch the orderDetails of the order made by the user`, () => {
        //<> try to fetch the orderDetails of the order made by the user

        test(`error in fetching the order details`, async () => {
          const req = Mock.mockRequest();
          const res = Mock.mockResponse();
          req.body.user_id = true;
          req.body.product_id = true;
          req.body.quantity = true;

          const err = new Error("a simple error");

          const getOrderDetailsSpy = jestMock
            .spyOn(orderModel, "getOrderDetails")
            .mockImplementation((data, cb) => {
              cb(err, null);
            });

          await orderController.editOrder(req, res);
          expect(getOrderDetailsSpy).toHaveBeenCalled();
          expect(res.status).toHaveBeenCalledWith(codes.internalServerError);
          expect(res.send).toHaveBeenCalledWith({
            success: false,
            status: codes.internalServerError,
            msg: `Unable to fetch the order of the user`,
            error: err,
          });
        });

        describe(`successfully fetched order details`, () => {
          //<> successfully fetched order details

          describe(`Look for the product details that corresponds to this order and the specified product`, () => {
            //<> Look for the product details that corresponds to this order and the specified product

            test(`error in fetching the product details`, async () => {
              const req = Mock.mockRequest();
              const res = Mock.mockResponse();

              req.body.user_id = true;
              req.body.product_id = true;
              req.body.quantity = true;
              req.body.order_id = true;

              const err = new Error("a simple error");

              const getOrderDetailsSpy = jestMock
                .spyOn(orderModel, "getOrderDetails")
                .mockImplementation((data, cb) => {
                  cb(null, Payload.controller);
                });

              const getOrderProductSpy = jestMock
                .spyOn(orderModel, "getOrderProduct")
                .mockImplementation((data, cb) => {
                  cb(err, null);
                });

              await orderController.editOrder(req, res);
              expect(getOrderDetailsSpy).toHaveBeenCalled();
              expect(getOrderProductSpy).toHaveBeenCalled();
              expect(res.status).toHaveBeenCalledWith(
                codes.internalServerError
              );
              expect(res.send).toHaveBeenCalledWith({
                success: false,
                status: codes.internalServerError,
                msg: `unable to fetch the product`,
                error: err,
              });
            });

            describe(`successfully fetched the product details`, () => {
              //<> successfully fetched the product details

              describe(`Go for editing the order`, () => {
                //<> Go for editing the order

                test(`error in editing the order`, async () => {
                  const req = Mock.mockRequest();
                  const res = Mock.mockResponse();

                  req.body.user_id = true;
                  req.body.product_id = true;
                  req.body.quantity = true;
                  req.body.order_id = true;
                  req.body.total = true;

                  const err = new Error("a simple error");

                  const getOrderDetailsSpy = jestMock
                    .spyOn(orderModel, "getOrderDetails")
                    .mockImplementation((data, cb) => {
                      cb(null, Payload.controller);
                    });

                  const getOrderProductSpy = jestMock
                    .spyOn(orderModel, "getOrderProduct")
                    .mockImplementation((data, cb) => {
                      cb(null, Payload.controller);
                    });

                  const editOrderSpy = jestMock
                    .spyOn(orderModel, "editOrder")
                    .mockImplementation((data, cb) => {
                      cb(err, null);
                    });

                  await orderController.editOrder(req, res);
                  expect(getOrderDetailsSpy).toHaveBeenCalled();
                  expect(getOrderProductSpy).toHaveBeenCalled();
                  expect(editOrderSpy).toHaveBeenCalled();
                  expect(res.status).toHaveBeenCalledWith(
                    codes.internalServerError
                  );
                  expect(res.send).toHaveBeenCalledWith({
                    success: false,
                    status: codes.internalServerError,
                    msg: `Unable to edit the order`,
                    error: err,
                  });
                });

                describe(`Go for editing the order item`, () => {
                  //<> Go for editing the order item

                  test(`error in editing the order item`, async () => {
                    const req = Mock.mockRequest();
                    const res = Mock.mockResponse();

                    req.body.user_id = true;
                    req.body.product_id = true;
                    req.body.quantity = true;
                    req.body.order_id = true;
                    req.body.total = true;

                    const err = new Error("a simple error");

                    const getOrderDetailsSpy = jestMock
                      .spyOn(orderModel, "getOrderDetails")
                      .mockImplementation((data, cb) => {
                        cb(null, Payload.controller);
                      });

                    const getOrderProductSpy = jestMock
                      .spyOn(orderModel, "getOrderProduct")
                      .mockImplementation((data, cb) => {
                        cb(null, Payload.controller);
                      });

                    const editOrderSpy = jestMock
                      .spyOn(orderModel, "editOrder")
                      .mockImplementation((data, cb) => {
                        cb(null, Payload.controller);
                      });

                    const editOrderItemSpy = jestMock
                      .spyOn(orderModel, "editOrderItem")
                      .mockImplementation((data, cb) => {
                        cb(err, null);
                      });

                    await orderController.editOrder(req, res);
                    expect(getOrderDetailsSpy).toHaveBeenCalled();
                    expect(getOrderProductSpy).toHaveBeenCalled();
                    expect(editOrderSpy).toHaveBeenCalled();
                    expect(editOrderItemSpy).toHaveBeenCalled();
                    expect(res.status).toHaveBeenCalledWith(
                      codes.internalServerError
                    );
                    expect(res.send).toHaveBeenCalledWith({
                      success: false,
                      status: codes.internalServerError,
                      msg: `Unable to edit the order item`,
                      error: err,
                    });
                  });

                  test(`successfully edited the order`, async () => {
                    const req = Mock.mockRequest();
                    const res = Mock.mockResponse();

                    req.body.user_id = true;
                    req.body.product_id = true;
                    req.body.quantity = true;
                    req.body.order_id = true;
                    req.body.total = true;

                    const getOrderDetailsSpy = jestMock
                      .spyOn(orderModel, "getOrderDetails")
                      .mockImplementation((data, cb) => {
                        cb(null, Payload.controller);
                      });

                    const getOrderProductSpy = jestMock
                      .spyOn(orderModel, "getOrderProduct")
                      .mockImplementation((data, cb) => {
                        cb(null, Payload.controller);
                      });

                    const editOrderSpy = jestMock
                      .spyOn(orderModel, "editOrder")
                      .mockImplementation((data, cb) => {
                        cb(null, Payload.controller);
                      });

                    const editOrderItemSpy = jestMock
                      .spyOn(orderModel, "editOrderItem")
                      .mockImplementation((data, cb) => {
                        cb(null, Payload.controller);
                      });

                    await orderController.editOrder(req, res);
                    expect(getOrderDetailsSpy).toHaveBeenCalled();
                    expect(getOrderProductSpy).toHaveBeenCalled();
                    expect(editOrderSpy).toHaveBeenCalled();
                    expect(editOrderItemSpy).toHaveBeenCalled();
                    expect(res.status).toHaveBeenCalledWith(codes.success);
                    expect(res.send).toHaveBeenCalledWith({
                      success: true,
                      status: codes.success,
                      msg: `Successfully edited the order`,
                      data: Payload.controller,
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});
