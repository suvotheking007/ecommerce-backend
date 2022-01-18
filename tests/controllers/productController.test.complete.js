const productController = require("../../src/controllers/productController");
const productModel = require("../../src/models/product");
const Mock = require("../mocker");
const jestMock = require("jest-mock");
const Payload = require("../payload");
const Config = require("../../src/constants/backendConfig");

const codes = Config.httpCodes;

describe(`testing listProducts`, () => {
  //<> testing listProducts

  describe(`testing request validity`, () => {
    //<> testing request validity

    test(`request is invalid`, async () => {
      const req = Mock.mockRequest();
      const res = Mock.mockResponse();

      const listProductsSpy = jestMock.spyOn(productModel, "listProducts");

      await productController.listProducts(req, res);
      expect(listProductsSpy).toHaveBeenCalledTimes(0);
      expect(res.status).toHaveBeenCalledWith(codes.badRequest);
      expect(res.send).toHaveBeenCalledWith({
        success: false,
        msg: `The arguments given is not what is expected`,
        status: codes.badRequest,
      });
    });

    describe(`request is valid look for the product details`, () => {
      //<> request is valid look for the product details

      test(`error in fetching the the product details`, async () => {
        const req = Mock.mockRequest();
        const res = Mock.mockResponse();

        req.body.category_id = true;
        req.body.min_price = true;
        req.body.max_price = true;

        const err = new Error("a simple error");

        const listProductsSpy = jestMock
          .spyOn(productModel, "listProducts")
          .mockImplementation((data, cb) => {
            cb(err, null);
          });

        await productController.listProducts(req, res);
        expect(listProductsSpy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(codes.internalServerError);
        expect(res.send).toHaveBeenCalledWith({
          success: false,
          status: codes.internalServerError,
          msg: `Failed to fetch products`,
          error: err,
        });
      });

      describe(`successfully fetched product details`, () => {
        //<> successfully fetched product details

        test(`list all the products as specified by requested option`, async () => {
          const req = Mock.mockRequest();
          const res = Mock.mockResponse();

          req.body.category_id = true;
          req.body.min_price = true;
          req.body.max_price = true;

          const listProductsSpy = jestMock
            .spyOn(productModel, "listProducts")
            .mockImplementation((data, cb) => {
              cb(null, Payload.controller);
            });

          await productController.listProducts(req, res);
          expect(listProductsSpy).toHaveBeenCalled();
          expect(res.status).toHaveBeenCalledWith(codes.success);
          expect(res.send).toHaveBeenCalledWith({
            success: true,
            msg: `Successfully listed products`,
            status: codes.success,
            data: Payload.controller,
          });
        });
      });
    });
  });
});

describe(`testing addProduct`, () => {
  //<> testing addProduct

  describe(`checking request validity`, () => {
    //<> checking request validity

    test(`request is invalid`, async () => {
      const req = Mock.mockRequest();
      const res = Mock.mockResponse();

      const addProductSpy = jestMock.spyOn(productModel, "addProduct");

      await productController.addProduct(req, res);
      expect(addProductSpy).toHaveBeenCalledTimes(0);
      expect(res.status).toHaveBeenCalledWith(codes.badRequest);
      expect(res.send).toHaveBeenCalledWith({
        success: false,
        msg: `The arguments given is not what is expected`,
        status: codes.badRequest,
      });
    });

    describe(`request is valid go for adding the product`, () => {
      //<> request is valid go for adding the product

      test(`error in adding the product`, async () => {
        const req = Mock.mockRequest();
        const res = Mock.mockResponse();
        const err = new Error("a simple error");

        req.body.name = true;
        req.body.price = true;
        req.body.description = true;
        req.body.category_id = true;
        req.body.vendor_id = true;

        const addProductSpy = jestMock
          .spyOn(productModel, "addProduct")
          .mockImplementation((data, cb) => {
            cb(err, null);
          });

        await productController.addProduct(req, res);
        expect(addProductSpy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(codes.internalServerError);
        expect(res.send).toHaveBeenCalledWith({
          success: false,
          status: codes.internalServerError,
          msg: `Unable to add the product`,
          error: err,
        });
      });

      describe(`there was no error in adding the product`, () => {
        //<> there was no error in adding the product

        test(`product is stored in the database`, async () => {
          const req = Mock.mockRequest();
          const res = Mock.mockResponse();

          req.body.name = true;
          req.body.price = true;
          req.body.description = true;
          req.body.category_id = true;
          req.body.vendor_id = true;

          const addProductSpy = jestMock
            .spyOn(productModel, "addProduct")
            .mockImplementation((data, cb) => {
              cb(null, Payload.controller);
            });

          await productController.addProduct(req, res);
          expect(addProductSpy).toHaveBeenCalled();
          expect(res.status).toHaveBeenCalledWith(codes.success);
          expect(res.send).toHaveBeenCalledWith({
            success: true,
            msg: `Successfully added the product`,
            status: codes.success,
            data: Payload.controller,
          });
        });
      });
    });
  });
});
