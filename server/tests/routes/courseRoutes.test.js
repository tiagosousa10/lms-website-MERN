import { jest } from "@jest/globals";
import httpMocks from "node-mocks-http";

// 1) Mocks ESM — define ANTES de importar o router
await jest.unstable_mockModule("../../controllers/courseController.js", () => ({
  getAllCourses: jest.fn((_req, res) =>
    res.status(200).json({ handler: "getAllCourses" })
  ),
  getCourseId: jest.fn((req, res) =>
    res.status(200).json({ handler: "getCourseId", id: req.params.id })
  ),
}));

// 2) Só agora importa o router (dinâmico) para apanhar os mocks
const courseRouter = (await import("../../routes/courseRoute.js")).default;

// Helpers
const listRoutes = (router) =>
  router.stack
    .filter((layer) => layer.route)
    .map((layer) => ({
      path: layer.route.path,
      methods: Object.keys(layer.route.methods)
        .filter((m) => layer.route.methods[m])
        .map((m) => m.toUpperCase()),
    }));

function getFirstHandler(method, path) {
  const layer = courseRouter.stack.find(
    (l) =>
      l.route && l.route.path === path && l.route.methods[method.toLowerCase()]
  );
  if (!layer) throw new Error(`Route ${method} ${path} não encontrada`);
  return layer.route.stack[0].handle;
}

describe("courseRouter – paths e métodos", () => {
  test("regista GET /all", () => {
    expect(listRoutes(courseRouter)).toContainEqual({
      path: "/all",
      methods: ["GET"],
    });
  });

  test("regista GET /:id", () => {
    expect(listRoutes(courseRouter)).toContainEqual({
      path: "/:id",
      methods: ["GET"],
    });
  });
});

describe("courseRouter – handlers invocados", () => {
  test("GET /all chama getAllCourses", async () => {
    const handler = getFirstHandler("GET", "/all");
    const req = httpMocks.createRequest({ method: "GET", url: "/courses/all" });
    const res = httpMocks.createResponse();

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({ handler: "getAllCourses" });
  });

  test("GET /:id chama getCourseId com param", async () => {
    const handler = getFirstHandler("GET", "/:id");
    const req = httpMocks.createRequest({
      method: "GET",
      url: "/courses/7",
      params: { id: "7" },
    });
    const res = httpMocks.createResponse();

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({ handler: "getCourseId", id: "7" });
  });
});
