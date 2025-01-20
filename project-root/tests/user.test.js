const request = require("supertest");
const app = require("../config/app");

describe("User API", () => {
  it("should fetch all users", async () => {
    const res = await request(app).get("/api/users");
    expect(res.statusCode).toEqual(200);
  });
});
