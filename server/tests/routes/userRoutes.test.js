import { jest } from "@jest/globals";
import httpMocks from "node-mocks-http";

/* 1) Mock dos controllers — simples e “ecoam” body/params/query */
await jest.unstable_mockModule("../../controllers/userController.js", () => ({
  getUserData: jest.fn((req, res) =>
    res
      .status(200)
      .json({ handler: "getUserData", query: req.query, params: req.params })
  ),
  getAllUsersData: jest.fn((req, res) =>
    res.status(200).json({ handler: "getAllUsersData", query: req.query })
  ),
  purchaseCourse: jest.fn((req, res) =>
    res.status(201).json({ handler: "purchaseCourse", body: req.body })
  ),
  userEnrolledCourses: jest.fn((req, res) =>
    res.status(200).json({ handler: "userEnrolledCourses", query: req.query })
  ),
  updateUserCourseProgress: jest.fn((req, res) =>
    res
      .status(200)
      .json({ handler: "updateUserCourseProgress", body: req.body })
  ),
  getUserCourseProgress: jest.fn((req, res) =>
    res.status(200).json({ handler: "getUserCourseProgress", body: req.body })
  ),
  addUserRating: jest.fn((req, res) =>
    res.status(200).json({ handler: "addUserRating", body: req.body })
  ),
}));

/* 2) Import do router APÓS os mocks (ESM) */
const userRouter = (await import("../../routes/userRoutes.js")).default;

/* helper: devolve o último handler (controller) da rota pedida */
function getHandler(method, path) {
  const layer = userRouter.stack.find(
    (l) =>
      l.route && l.route.path === path && l.route.methods[method.toLowerCase()]
  );
  if (!layer) throw new Error(`Route ${method} ${path} não encontrada`);
  const stack = layer.route.stack;
  return stack[stack.length - 1].handle;
}

describe("userRouter — cenários com body/params/query (simples)", () => {
  test("GET /data usa query (ex: ?userId=42) e aceita params se existirem", async () => {
    const handler = getHandler("GET", "/data");
    const req = httpMocks.createRequest({
      method: "GET",
      url: "/user/data",
      query: { userId: "42" },
      params: { userId: "42" }, // params aqui é só demonstração
    });
    const res = httpMocks.createResponse();

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      handler: "getUserData",
      query: { userId: "42" },
      params: { userId: "42" },
    });
  });

  test("GET /all-users pode aceitar paginação via query", async () => {
    const handler = getHandler("GET", "/all-users");
    const req = httpMocks.createRequest({
      method: "GET",
      url: "/user/all-users?page=2&limit=10",
      query: { page: "2", limit: "10" },
    });
    const res = httpMocks.createResponse();

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      handler: "getAllUsersData",
      query: { page: "2", limit: "10" },
    });
  });

  test("POST /purchase lê body (courseId, paymentId)", async () => {
    const handler = getHandler("POST", "/purchase");
    const req = httpMocks.createRequest({
      method: "POST",
      url: "/user/purchase",
      body: { courseId: "c1", paymentId: "pay_123" },
    });
    const res = httpMocks.createResponse();

    await handler(req, res);

    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toEqual({
      handler: "purchaseCourse",
      body: { courseId: "c1", paymentId: "pay_123" },
    });
  });

  test("GET /enrolled-courses aceita query (ex: userId)", async () => {
    const handler = getHandler("GET", "/enrolled-courses");
    const req = httpMocks.createRequest({
      method: "GET",
      url: "/user/enrolled-courses?userId=42",
      query: { userId: "42" },
    });
    const res = httpMocks.createResponse();

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      handler: "userEnrolledCourses",
      query: { userId: "42" },
    });
  });

  test("POST /update-course-progress lê body (courseId, progress)", async () => {
    const handler = getHandler("POST", "/update-course-progress");
    const req = httpMocks.createRequest({
      method: "POST",
      url: "/user/update-course-progress",
      body: { courseId: "c1", progress: 0.75 },
    });
    const res = httpMocks.createResponse();

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      handler: "updateUserCourseProgress",
      body: { courseId: "c1", progress: 0.75 },
    });
  });

  test("POST /get-course-progress lê body (courseId)", async () => {
    const handler = getHandler("POST", "/get-course-progress");
    const req = httpMocks.createRequest({
      method: "POST",
      url: "/user/get-course-progress",
      body: { courseId: "c1" },
    });
    const res = httpMocks.createResponse();

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      handler: "getUserCourseProgress",
      body: { courseId: "c1" },
    });
  });

  test("POST /add-rating lê body (courseId, rating, comment)", async () => {
    const handler = getHandler("POST", "/add-rating");
    const req = httpMocks.createRequest({
      method: "POST",
      url: "/user/add-rating",
      body: { courseId: "c1", rating: 5, comment: "Excelente!" },
    });
    const res = httpMocks.createResponse();

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      handler: "addUserRating",
      body: { courseId: "c1", rating: 5, comment: "Excelente!" },
    });
  });
});
