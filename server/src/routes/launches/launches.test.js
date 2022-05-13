const request = require("supertest");
const app = require("../../app");
const { mongoConnect, mongoDisconnect } = require("../../services/mongo");

describe("Launches API", () => {
  beforeAll(async () => {
    await mongoConnect();
  });

  afterAll(async () => {
    await mongoDisconnect();
  })

  describe('Test GET /launches', () => {
    test('should respond with 200 success', async () => {
      await request(app)
        .get("/v1/launches")
        .expect("Content-Type", /json/)
        .expect(200);
    });
  });

  describe('Test POST /launches', () => {
    const completeLaunchData = {
      mission: "USS Enterprise",
      rocket: "NCC 1701-D",
      launchDate: "September 21, 2025",
      target: "Kepler-66 f",
    };
  
    const { launchDate, ...restLaunchData } = completeLaunchData;
  
    test('should respond with 201 created', async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(completeLaunchData)
        .expect("Content-Type", /json/)
        .expect(201);
  
      expect(response.body).toMatchObject({
        ...restLaunchData
      });
  
      const requestDate = new Date(launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();
  
      expect(requestDate).toBe(responseDate);
    });
  
    test('should catch missing required properties', async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(restLaunchData)
        .expect("Content-Type", /json/)
        .expect(400);
  
      expect(response.body).toStrictEqual({
        error: "Missing required launch property",
      });
    });
  
    test('should catch invalid dates', async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send({
          ...restLaunchData,
          launchDate: "hello",
        })
        .expect("Content-Type", /json/)
        .expect(400);
  
      expect(response.body).toStrictEqual({
        error: "Invalid launch date",
      });
    });
  });
});
