import { jest } from "@jest/globals";
import httpMocks from "node-mocks-http";

// 1) Mocks mínimos (ANTES do import do router)
await jest.unstable_mockModule(
  "../../controllers/educatorController.js",
  () => ({
    updateRoleToEducator: jest.fn((_, res) =>
      res.status(200).json({ ok: "updateRoleToEducator" })
    ),
    addCourse: jest.fn((req, res) =>
      res.status(201).json({ ok: "addCourse", hasFile: !!req.file })
    ),
    getEducatorCourses: jest.fn((_, res) =>
      res.status(200).json({ ok: "getEducatorCourses" })
    ),
    educatorDashboardData: jest.fn((_, res) =>
      res.status(200).json({ ok: "educatorDashboardData" })
    ),
    getEnrolledStudentsData: jest.fn((_, res) =>
      res.status(200).json({ ok: "getEnrolledStudentsData" })
    ),
  })
);

// middlewares viram pass-through simples
await jest.unstable_mockModule("../../configs/multer.js", () => ({
  default: {
    single: () => (req, _res, next) => {
      req.file = { originalname: "x.png" };
      next();
    },
  },
}));
await jest.unstable_mockModule("../../middlewares/authMiddleware.js", () => ({
  protectEducator: (_req, _res, next) => next(),
}));

// 2) Import do router DEPOIS dos mocks
const educatorRouter = (await import("../../routes/educatorRoutes.js")).default;

// helper simples: devolve o ÚLTIMO handler (controller) de uma rota
function getLastHandler(method, path) {
  const layer = educatorRouter.stack.find(
    (l) =>
      l.route && l.route.path === path && l.route.methods[method.toLowerCase()]
  );
  if (!layer) throw new Error(`Route ${method} ${path} não encontrada`);
  const stack = layer.route.stack;
  return stack[stack.length - 1].handle; // último = controller
}

describe("educatorRouter (simples)", () => {
  test("GET /update-role → controller corre e 200", async () => {
    const handler = getLastHandler("GET", "/update-role");
    const req = httpMocks.createRequest({
      method: "GET",
      url: "/educator/update-role",
    });
    const res = httpMocks.createResponse();
    await handler(req, res);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({ ok: "updateRoleToEducator" });
  });

  test("POST /add-course → upload + auth no-op; controller responde 201", async () => {
    // apesar de haver middlewares, chamamos só o último handler (controller),
    // porque os middlewares estão mocked como pass-through e não alteram o fluxo.
    const handler = getLastHandler("POST", "/add-course");
    const req = httpMocks.createRequest({
      method: "POST",
      url: "/educator/add-course",
    });
    // simulamos que multer já pôs file (o nosso mock também faria isso)
    req.file = { originalname: "x.png" };
    const res = httpMocks.createResponse();
    await handler(req, res);
    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toEqual({ ok: "addCourse", hasFile: true });
  });

  test("GET /courses → 200", async () => {
    const handler = getLastHandler("GET", "/courses");
    const req = httpMocks.createRequest({
      method: "GET",
      url: "/educator/courses",
    });
    const res = httpMocks.createResponse();
    await handler(req, res);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({ ok: "getEducatorCourses" });
  });

  test("GET /dashboard → 200", async () => {
    const handler = getLastHandler("GET", "/dashboard");
    const req = httpMocks.createRequest({
      method: "GET",
      url: "/educator/dashboard",
    });
    const res = httpMocks.createResponse();
    await handler(req, res);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({ ok: "educatorDashboardData" });
  });

  test("GET /enrolled-students → 200", async () => {
    const handler = getLastHandler("GET", "/enrolled-students");
    const req = httpMocks.createRequest({
      method: "GET",
      url: "/educator/enrolled-students",
    });
    const res = httpMocks.createResponse();
    await handler(req, res);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({ ok: "getEnrolledStudentsData" });
  });
});
