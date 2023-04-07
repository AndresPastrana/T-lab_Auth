const mongoose = require("mongoose");
const { server, app } = require("../../index");
// What our loging service should do
// TODO:
//1 email and password not send : 404 , error list
// TODO:
//2 email and password send but wrong credentials: 401 ,error  wrong credentials
// TODO:
//3 Correct credentials : 200 , resp {access_token : "asdas" , re}

describe("Login ", () => {
  beforeEach(async () => {});

  afterEach(async () => {});

  test("Should return a 404 if email or password are not provided", () => {
    expect(true).toBe(true);
  });
});
