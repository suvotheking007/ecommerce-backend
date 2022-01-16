const Colors = require("colors");
const orderController = require("../../src/controllers/orderController");
const orderModel = require("../../src/models/order");
const productModel = require("../../src/models/product");
const Payload = require("../payload.js");
const Config = require("../../src/constants/backendConfig");
const Mock = require("../mocker");

const jestMock = require("jest-mock");

const codes = Config.httpCodes;

test(`${Colors.red.bold(`request invalid `)}`, async () => {
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

test(`${Colors.green.bold(`request valid `)}${Colors.red.bold(
  `but error in fetching product details `
)}`, async () => {
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

test(`${Colors.green.bold(
  `request valid and fetched product details `
)}${Colors.red.bold(`but error in fetching order details `)}`, async () => {
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

test(`${Colors.green.bold(
  `request valid and fetched product details and fetched empty order details `
)}${Colors.red.bold(`but error in adding a new order `)}`, async () => {
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

test(`${Colors.green.bold(
  `request valid and fetched product details and fetched empty order details and added a new order `
)}${Colors.red.bold(`but error in adding a new order item `)}`, async () => {
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

  expect(res.status).toHaveBeenCalledWith(codes.internalServerError);
  expect(res.send).toHaveBeenCalledWith({
    success: false,
    status: codes.internalServerError,
    msg: `Unable to add the new order item`,
    error: err,
  });
});

test(`${Colors.green.bold(
  `request valid and fetched product details and fetched empty order details and added a new order and added a new order item `
)}`, async () => {
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

test(`${Colors.green.bold(
  `request valid and fetched product details and fetched nonEmpty order details `
)}${Colors.red.bold(`but error in adding a new order `)}`, async () => {
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

test(`${Colors.green.bold(
  `request valid and fetched product details and fetched nonEmpty order details and added a new order `
)}${Colors.red.bold(`but error in adding a new order item `)}`, async () => {
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

  expect(res.status).toHaveBeenCalledWith(codes.internalServerError);
  expect(res.send).toHaveBeenCalledWith({
    success: false,
    status: codes.internalServerError,
    msg: `Unable to add the new order item`,
    error: err,
  });
});

test(`${Colors.green.bold(
  `request valid and fetched product details and fetched empty order details and added a new order and added a new order item `
)}`, async () => {
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
