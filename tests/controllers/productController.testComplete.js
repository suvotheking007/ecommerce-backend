const productController = require("../../src/controllers/productController");
const productModel = require("../../src/models/product");
const Mock = require("../mocker");
const jestSpy = require("jest-mock");

const testPayload = [
  {
    productId: 1,
    orderId: 2,
  },
  {
    productId: 1,
    orderId: 2,
  },
];

test("Check if the listProduct can handel the data properly", async () => {
  const req = Mock.mockRequest();
  const res = Mock.mockResponse();

  const spy = jestSpy
    .spyOn(productModel, "listProducts")
    .mockImplementation((data, cb) => {
      cb(null, testPayload);
    });

  await productController.listProducts(req, res);

  expect(spy).toHaveBeenCalled();
  expect(res.send).toHaveBeenCalledWith({
    success: true,
    msg: "Successfully fetched products",
    status: 200,
    products: testPayload,
  });
});

test("Check if the listProduct can handel error properly", async () => {
  const req = Mock.mockRequest();
  const res = Mock.mockResponse();

  const spy = jestSpy
    .spyOn(productModel, "listProducts")
    .mockImplementation((data, cb) => {
      cb(new Error("A error"), null);
    });

  await productController.listProducts(req, res);

  expect(spy).toHaveBeenCalled();
  expect(res.send).toHaveBeenCalledWith({
    success: false,
    msg: "Failed to fetch products",
    status: 500,
  });
});

test("Check if the addProduct can handel the situation when the request body does not have sufficient data required to send the response", async () => {
  const req = Mock.mockRequest();
  const res = Mock.mockResponse();

  const spy = jestSpy
    .spyOn(productModel, "addProduct")
    .mockImplementation((data, cb) => {
      cb(null, testPayload);
    });

  await productController.addProduct(req, res);

  expect(spy).toHaveBeenCalledTimes(0);
  expect(res.send).toHaveBeenCalledWith({
    message: "Please enter all the fields",
  });
});

test("check if addProduct can add a product", async () => {
  const req = Mock.mockRequest();
  const res = Mock.mockResponse();

  req.body = {
    name: "Galaxy",
    price: 23000,
    description: "a phone",
    categoryId: 2,
    vendorId: 3,
  };

  const spy = jestSpy
    .spyOn(productModel, "addProduct")
    .mockImplementation((data, cb) => {
      cb(null, testPayload);
    });

  await productController.addProduct(req, res);

  expect(spy).toHaveBeenCalled();
  expect(res.send).toHaveBeenCalledWith({
    success: true,
    msg: "Product added successfully",
    status: 200,
    products: testPayload,
  });
});

test("check if any error can be handled properly while adding a product", async () => {
  const req = Mock.mockRequest();
  const res = Mock.mockResponse();

  req.body = {
    name: "Galaxy",
    price: 23000,
    description: "a phone",
    categoryId: 2,
    vendorId: 3,
  };

  const spy = jestSpy
    .spyOn(productModel, "addProduct")
    .mockImplementation((data, cb) => {
      cb(new Error("an error"), null);
    });

  await productController.addProduct(req, res);

  expect(spy).toHaveBeenCalled();
  expect(res.send).toHaveBeenCalledWith({
    success: false,
    msg: "Failed to add the product",
    status: 500,
  });
});
