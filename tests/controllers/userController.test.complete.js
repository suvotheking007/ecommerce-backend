const userController = require("../../src/controllers/userController");
const userModel = require("../../src/models/user");
const jestMock = require("jest-mock");
const Mock = require("../mocker");
const Config = require("../../src/constants/backendConfig");
const Payload = require("../payload");

const codes = Config.httpCodes;

describe(`testing signup`, () => {
  //<> testing signup

  test(`If the request is invalid`, async () => {
    const req = Mock.mockRequest();
    const res = Mock.mockResponse();

    const getUserSignupDetailsSpy = jestMock.spyOn(
      userModel,
      "getUserSignupDetails"
    );

    await userController.signup(req, res);
    expect(getUserSignupDetailsSpy).toHaveBeenCalledTimes(0);
    expect(res.status).toHaveBeenCalledWith(codes.badRequest);
    expect(res.send).toHaveBeenCalledWith({
      success: false,
      msg: `The arguments given is not what is expected`,
      status: codes.badRequest,
    });
  });

  describe(`The request is valid`, () => {
    //<> The request is valid

    test(`If there comes some error in fetching the user signup details`, async () => {
      const req = Mock.mockRequest();
      const res = Mock.mockResponse();

      const err = new Error("a simple error");

      req.body.user_name = true;
      req.body.user_password = true;

      const getUserSignupDetailsSpy = jestMock
        .spyOn(userModel, "getUserSignupDetails")
        .mockImplementation((data, cb) => {
          cb(err, null);
        });

      await userController.signup(req, res);
      expect(getUserSignupDetailsSpy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(codes.internalServerError);
      expect(res.send).toHaveBeenCalledWith({
        success: false,
        status: codes.internalServerError,
        msg: `Unable to get user signup details`,
        error: err,
      });
    });

    describe(`fetched  empty user signup details`, () => {
      //<> fetched empty user signup details

      test(`If there comes some error in signing up the user`, async () => {
        const req = Mock.mockRequest();
        const res = Mock.mockResponse();

        const err = new Error("a simple error");

        req.body.user_name = true;
        req.body.user_password = true;

        const getUserSignupDetailsSpy = jestMock
          .spyOn(userModel, "getUserSignupDetails")
          .mockImplementation((data, cb) => {
            cb(null, Payload.empty);
          });
        const signupSpy = jestMock
          .spyOn(userModel, "signup")
          .mockImplementation((data, cb) => {
            cb(err, null);
          });

        await userController.signup(req, res);
        expect(getUserSignupDetailsSpy).toHaveBeenCalled();
        expect(signupSpy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(codes.internalServerError);
        expect(res.send).toHaveBeenCalledWith({
          success: false,
          status: codes.internalServerError,
          msg: `Unable to sign up`,
          error: err,
        });
      });

      test(`Successfully signing up the user`, async () => {
        const req = Mock.mockRequest();
        const res = Mock.mockResponse();

        req.body.user_name = true;
        req.body.user_password = true;

        const getUserSignupDetailsSpy = jestMock
          .spyOn(userModel, "getUserSignupDetails")
          .mockImplementation((data, cb) => {
            cb(null, Payload.empty);
          });
        const signupSpy = jestMock
          .spyOn(userModel, "signup")
          .mockImplementation((data, cb) => {
            cb(null, Payload.controller);
          });

        await userController.signup(req, res);
        expect(getUserSignupDetailsSpy).toHaveBeenCalled();
        expect(signupSpy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(codes.success);
        expect(res.send).toHaveBeenCalledWith({
          success: true,
          msg: `Successfully signed up`,
          status: codes.success,
          data: Payload.controller,
        });
      });
    });

    describe(`fetched non empty user signup details`, () => {
      //<> fetched non empty user signup details

      test(`Make the user aware of the fact that he or she is already signed up`, async () => {
        const req = Mock.mockRequest();
        const res = Mock.mockResponse();

        req.body.user_name = true;
        req.body.user_password = true;

        const getUserSignupDetailsSpy = jestMock
          .spyOn(userModel, "getUserSignupDetails")
          .mockImplementation((data, cb) => {
            cb(null, Payload.controller);
          });

        await userController.signup(req, res);
        expect(getUserSignupDetailsSpy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(codes.success);
        expect(res.send).toHaveBeenCalledWith({
          success: true,
          msg: `User already exist`,
          status: codes.success,
          data: Payload.controller,
        });
      });
    });
  });
});

describe(`testing register`, () => {
  //<> testing register

  test(`if the request is invalid`, async () => {
    const req = Mock.mockRequest();
    const res = Mock.mockResponse();

    const getUserSignupDetailsSpy = jestMock.spyOn(
      userModel,
      "getUserSignupDetails"
    );

    await userController.register(req, res);
    expect(getUserSignupDetailsSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(codes.badRequest);
    expect(res.send).toHaveBeenCalledWith({
      success: false,
      msg: `The arguments given is not what is expected`,
      status: codes.badRequest,
    });
  });

  describe(`The request is valid`, () => {
    //<> The request is valid

    test(`if there is an error in fetching the signup details for the user`, async () => {
      const req = Mock.mockRequest();
      const res = Mock.mockResponse();

      const err = new Error("a simple error");

      req.body.user_name = true;
      req.body.user_originalName = true;
      req.body.user_email = true;
      req.body.user_phone = true;
      req.body.user_address = true;

      const getUserSignupDetailsSpy = jestMock
        .spyOn(userModel, "getUserSignupDetails")
        .mockImplementation((data, cb) => {
          cb(err, null);
        });

      await userController.register(req, res);
      expect(getUserSignupDetailsSpy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(codes.internalServerError);
      expect(res.send).toHaveBeenCalledWith({
        success: false,
        status: codes.internalServerError,
        msg: `Unable to get user signup details`,
        error: err,
      });
    });

    describe(`If the fetched signup details is not empty`, () => {
      //<> If the fetched signup details is not empty

      test(`If there occurs an error in registering the details of the user`, async () => {
        const req = Mock.mockRequest();
        const res = Mock.mockResponse();

        const err = new Error("a simple error");

        req.body.user_name = true;
        req.body.user_originalName = true;
        req.body.user_email = true;
        req.body.user_phone = true;
        req.body.user_address = true;
        req.body.user_id = true;

        const getUserSignupDetailsSpy = jestMock
          .spyOn(userModel, "getUserSignupDetails")
          .mockImplementation((data, cb) => {
            cb(null, Payload.controller);
          });

        const registerDetailsSpy = jestMock
          .spyOn(userModel, "registerDetails")
          .mockImplementation((data, cb) => {
            cb(err, null);
          });

        await userController.register(req, res);
        expect(getUserSignupDetailsSpy).toHaveBeenCalled();
        expect(registerDetailsSpy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(codes.internalServerError);
        expect(res.send).toHaveBeenCalledWith({
          success: false,
          status: codes.internalServerError,
          msg: `Unable to register user`,
          error: err,
        });
      });

      test(`Registering the user details`, async () => {
        const req = Mock.mockRequest();
        const res = Mock.mockResponse();

        req.body.user_name = true;
        req.body.user_originalName = true;
        req.body.user_email = true;
        req.body.user_phone = true;
        req.body.user_address = true;
        req.body.user_id = true;

        const getUserSignupDetailsSpy = jestMock
          .spyOn(userModel, "getUserSignupDetails")
          .mockImplementation((data, cb) => {
            cb(null, Payload.controller);
          });

        const registerDetailsSpy = jestMock
          .spyOn(userModel, "registerDetails")
          .mockImplementation((data, cb) => {
            cb(null, Payload.controller);
          });

        await userController.register(req, res);
        expect(getUserSignupDetailsSpy).toHaveBeenCalled();
        expect(registerDetailsSpy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(codes.success);
        expect(res.send).toHaveBeenCalledWith({
          success: true,
          msg: `Successfully registered all the details of the user`,
          status: codes.success,
          data: Payload.controller,
        });
      });
    });

    describe(`If the fetched signup details is empty`, () => {
      //<> if the fetched signup details is empty

      test(`Making the user aware of the fact that he has to signup first in order to register some details`, async () => {
        const req = Mock.mockRequest();
        const res = Mock.mockResponse();

        req.body.user_name = true;
        req.body.user_originalName = true;
        req.body.user_email = true;
        req.body.user_phone = true;
        req.body.user_address = true;

        const getUserSignupDetailsSpy = jestMock
          .spyOn(userModel, "getUserSignupDetails")
          .mockImplementation((data, cb) => {
            cb(null, Payload.empty);
          });

        await userController.register(req, res);
        expect(getUserSignupDetailsSpy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(codes.success);
        expect(res.send).toHaveBeenCalledWith({
          success: true,
          msg: `User is not signed up yet`,
          status: codes.success,
          data: Payload.empty,
        });
      });
    });
  });
});

describe(`testing login`, () => {
  //<> testing login

  test(`If the request is invalid`, async () => {
    const req = Mock.mockRequest();
    const res = Mock.mockResponse();

    const loginSpy = jestMock.spyOn(userModel, "login");

    await userController.login(req, res);
    expect(loginSpy).toHaveBeenCalledTimes(0);
    expect(res.status).toHaveBeenCalledWith(codes.badRequest);
    expect(res.send).toHaveBeenCalledWith({
      success: false,
      msg: `The arguments given is not what is expected`,
      status: codes.badRequest,
    });
  });

  describe(`Request is valid`, () => {
    //<> Request is valid

    test(`If any error occurs while fetching the login details`, async () => {
      const req = Mock.mockRequest();
      const res = Mock.mockResponse();

      const err = new Error("a simple error");

      req.body.user_name = true;
      req.body.user_password = true;

      const loginSpy = jestMock
        .spyOn(userModel, "login")
        .mockImplementation((data, cb) => {
          cb(err, null);
        });

      await userController.login(req, res);
      expect(loginSpy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(codes.internalServerError);
      expect(res.send).toHaveBeenCalledWith({
        success: false,
        status: codes.internalServerError,
        msg: `Unable to log in`,
        error: err,
      });
    });

    describe(`Successfully fetched login details`, () => {
      //<> Successfully fetched login details

      test(`if the fetched login details is not empty then login the user`, async () => {
        const req = Mock.mockRequest();
        const res = Mock.mockResponse();

        req.body.user_name = true;
        req.body.user_password = true;

        const loginSpy = jestMock
          .spyOn(userModel, "login")
          .mockImplementation((data, cb) => {
            cb(null, Payload.controller);
          });

        await userController.login(req, res);
        expect(loginSpy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(codes.success);
        expect(res.send).toHaveBeenCalledWith({
          success: true,
          msg: `Successfully logged in`,
          status: codes.success,
          data: Payload.controller,
        });
      });

      test(`if the fetched login details is empty then the user has entered an invalid password or user name`, async () => {
        const req = Mock.mockRequest();
        const res = Mock.mockResponse();

        req.body.user_name = true;
        req.body.user_password = true;

        const loginSpy = jestMock
          .spyOn(userModel, "login")
          .mockImplementation((data, cb) => {
            cb(null, Payload.empty);
          });

        await userController.login(req, res);
        expect(loginSpy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(codes.success);
        expect(res.send).toHaveBeenCalledWith({
          success: true,
          msg: `Invalid username or password`,
          status: codes.success,
          data: Payload.empty,
        });
      });
    });
  });
});
