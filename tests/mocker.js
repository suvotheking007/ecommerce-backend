const jestMock = require("jest-mock");

module.exports = {
  mockRequest: function () {
    const req = {};

    req.body = jestMock.fn().mockReturnValue(req);
    return req;
  },

  mockResponse: function () {
    const res = {};

    res.send = jestMock.fn().mockReturnValue(res);
    res.status = jestMock.fn().mockReturnValue(res);
    return res;
  },
};
