"user strinct";

const { NotFoundError, BadRequestError } = require("../expressError");
const db = require("../db.js");
const Job = require("./job.js")
const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    testJobIds,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/* ************************************ create */

describe("create", function () {
    let newJob = {
      companyHandle: "c1",
      title: "Test",
      salary: 100,
      equity: "0.1",
    };
  
    test("works", async function () {
      let job = await Job.create(newJob);
      expect(job).toEqual({
        ...newJob,
        id: expect.any(Number),
      });
    });
  });