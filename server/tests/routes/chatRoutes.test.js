import { jest } from "@jest/globals";
import httpMocks from "node-mocks-http";

// 1) Mock do controller (antes do import do router)
await jest.unstable_mockModule("../../controllers/chatController.js", () => ({
  getStreamToken: jest.fn((req, res) =>
    res.status(200).json({ handler: "getStreamToken", query: req.query })
  ),
}));

// 2) Import do router após o mock (ESM)
const chatRouter = (await import("../../routes/chatRoutes.js")).default;

// Helper para obter o último handler (controller) da rota
function getHandler(method, path) {
  const layer = chatRouter.stack.find(
    (l) =>
      l.route && l.route.path === path && l.route.methods[method.toLowerCase()]
  );
  if (!layer) throw new Error(`Route ${method} ${path} não encontrada`);
  const handlers = layer.route.stack;
  return handlers[handlers.length - 1].handle;
}

describe("chatRouter – rota /token", () => {
  test("GET /token → executa getStreamToken e responde com token", async () => {
    const handler = getHandler("GET", "/token");
    const req = httpMocks.createRequest({
      method: "GET",
      url: "/chat/token?userId=123",
      query: { userId: "123" },
    });
    const res = httpMocks.createResponse();

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      handler: "getStreamToken",
      query: { userId: "123" },
    });
  });
});
