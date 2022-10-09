import request from "supertest";

import app from "../../app.js";
import { connectMongoDB, disconnectMongoDB } from "../../utils/mongo.js";

describe("Lauches API", () => {
  beforeAll(async () => {
    await connectMongoDB();
  });

  afterAll(async () => {
    await disconnectMongoDB();
  });

  describe("Test GET /v1/launches", () => {
    test("should respond with 200 success", async () => {
      await request(app)
        .get("/v1/launches")
        .expect("Content-Type", /json/)
        .expect(200);
    });
  });

  describe("Test POST /v1/launches", () => {
    const launchData = {
      mission: "USS Enterprise",
      rocket: "NCC 1701-D",
      destination: "Kepler-452 b",
    };
    const launchDate = "January 4, 2028";

    test("should response with 201 success", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send({ ...launchData, launchDate })
        .expect("Content-Type", /json/)
        .expect(201);

      expect(response.body).toMatchObject(launchData);
      expect(new Date(response.body.launchDate).getTime()).toEqual(
        new Date(launchDate).getTime()
      );
    });

    test("should catch missing required properties", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(launchData)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toEqual({
        error: "Missing required launch property",
      });
    });

    test("should catch invalid date", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send({
          ...launchData,
          launchDate: "zppt",
        })
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toEqual({
        error: "Invalid launch date",
      });
    });
  });
});
