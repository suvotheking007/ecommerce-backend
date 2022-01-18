const categoryModel = require("../../src/models/category");
const categoryController = require("../../src/controllers/categoryController");
const jestMock = require("jest-mock");
const Mock = require("../mocker");
const Config = require("../../src/constants/backendConfig");
const Payload = require("../payload");

const codes = Config.httpCodes;

describe(`test listCategories`, () => {
  //<> test listCategories

  describe(`Try to fetch the categories that is present in the database`, () => {
    //<> Try to fetch the categories that is present in the database

    test(`error in fetching the categories`, async () => {
      const req = Mock.mockRequest();
      const res = Mock.mockResponse();
      const err = new Error("a simple error");

      const listCategoriesSpy = jestMock
        .spyOn(categoryModel, "listCategories")
        .mockImplementation((data, cb) => {
          cb(err, null);
        });

      await categoryController.listCategories(req, res);
      expect(listCategoriesSpy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(codes.internalServerError);
      expect(res.send).toHaveBeenCalledWith({
        success: false,
        status: codes.internalServerError,
        msg: `Unable to fetch categories`,
        error: err,
      });
    });

    describe(`Successfully fetched all the categories`, () => {
      //<> Successfully fetched all the categories

      test(`list all the categories that are obtained from the database`, async () => {
        const req = Mock.mockRequest();
        const res = Mock.mockResponse();

        const listCategoriesSpy = jestMock
          .spyOn(categoryModel, "listCategories")
          .mockImplementation((data, cb) => {
            cb(null, Payload.controller);
          });

        await categoryController.listCategories(req, res);
        expect(listCategoriesSpy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(codes.success);
        expect(res.send).toHaveBeenCalledWith({
          success: true,
          msg: `Successfully fetched categories`,
          status: codes.success,
          data: Payload.controller,
        });
      });
    });
  });
});
