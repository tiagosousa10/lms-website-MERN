// tests/routes/communityRoutes.test.js
import { jest } from "@jest/globals";
import httpMocks from "node-mocks-http"; // <— faltava este import!

// 1) Mock dos controllers (ESM) — NOTA: specifiers relativos
await jest.unstable_mockModule(
  "../../controllers/communityController.js",
  () => ({
    getAllUsers: jest.fn((_req, res) => res.status(200).json({ ok: true })),
    getRecommendedUsers: jest.fn((_req, res) =>
      res.status(200).json({ ok: true })
    ),
    getMyFriends: jest.fn((_req, res) => res.status(200).json({ ok: true })),
    getFriendRequests: jest.fn((_req, res) =>
      res.status(200).json({ ok: true })
    ),
    getOutgoingFriendReqs: jest.fn((_req, res) =>
      res.status(200).json({ ok: true })
    ),
    sendFriendRequest: jest.fn((req, res) =>
      res.status(201).json({ id: req.params.id })
    ),
    acceptFriendRequest: jest.fn((req, res) =>
      res.status(200).json({ id: req.params.id })
    ),
    removeFriend: jest.fn((_req, res) => res.status(204).end()),
  })
);

await jest.unstable_mockModule(
  "../../controllers/testimonialController.js",
  () => ({
    listRandomTestimonials: jest.fn((_req, res) =>
      res.status(200).json([{ id: 1 }])
    ),
    getMyTestimonials: jest.fn((_req, res) =>
      res.status(200).json([{ id: "me" }])
    ),
    getTestimonial: jest.fn((req, res) =>
      res.status(200).json({ id: req.params.id })
    ),
    createTestimonial: jest.fn((req, res) => res.status(201).json(req.body)),
    updateMyTestimonial: jest.fn((req, res) =>
      res.status(200).json({ id: req.params.id, ...req.body })
    ),
    deleteMyTestimonial: jest.fn((_req, res) => res.status(204).end()),
  })
);

// 2) Importa o router *depois* dos mocks
const communityRouter = (await import("../../routes/communityRoutes.js"))
  .default;

function findRoute(method, path) {
  const layer = communityRouter.stack.find(
    (l) =>
      l.route && l.route.path === path && l.route.methods[method.toLowerCase()]
  );
  if (!layer) throw new Error(`Route ${method} ${path} não encontrada`);
  // Express guarda os handlers em .route.stack (pode ter middlewares)
  return layer.route.stack.map((s) => s.handle);
}

describe("handlers do communityRouter (invocação direta)", () => {
  test("POST /friend-request/:id passa params corretamente", async () => {
    const [handler] = findRoute("POST", "/friend-request/:id");
    const req = httpMocks.createRequest({
      method: "POST",
      url: "/friend-request/123",
      params: { id: "123" },
    });
    const res = httpMocks.createResponse();

    await handler(req, res);

    expect(res.statusCode).toBe(201);
    expect(JSON.parse(res._getData())).toEqual({ id: "123" });
  });

  test("PUT /friend-request/:id/accept passa params", async () => {
    const [handler] = findRoute("PUT", "/friend-request/:id/accept");
    const req = httpMocks.createRequest({
      method: "PUT",
      url: "/friend-request/abc/accept",
      params: { id: "abc" },
    });
    const res = httpMocks.createResponse();
    await handler(req, res);
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({ id: "abc" });
  });

  test("DELETE /friends/:id retorna 204", async () => {
    const [handler] = findRoute("DELETE", "/friends/:id");
    const req = httpMocks.createRequest({
      method: "DELETE",
      url: "/friends/42",
      params: { id: "42" },
    });
    const res = httpMocks.createResponse();
    await handler(req, res);
    expect(res.statusCode).toBe(204);
  });

  test("POST /testimonials envia body ao controller", async () => {
    const [handler] = findRoute("POST", "/testimonials");
    const body = { text: "ótimo!" };
    const req = httpMocks.createRequest({
      method: "POST",
      url: "/testimonials",
      body,
    });
    const res = httpMocks.createResponse();
    await handler(req, res);
    expect(res.statusCode).toBe(201);
    expect(JSON.parse(res._getData())).toEqual(body);
  });

  test("PUT /testimonials/:id usa params + body", async () => {
    const [handler] = findRoute("PUT", "/testimonials/:id");
    const req = httpMocks.createRequest({
      method: "PUT",
      url: "/testimonials/9",
      params: { id: "9" },
      body: { text: "update" },
    });
    const res = httpMocks.createResponse();
    await handler(req, res);
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({ id: "9", text: "update" });
  });
});
