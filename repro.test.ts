import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";

const server = setupServer();

beforeAll(() => {
  server.listen();
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});

test.fails("repro with colon", async () => {
  server.use(
    http.get("http://localhost:*", () => HttpResponse.text("Hello world!")),
  );
  await expect(
    fetch("http://localhost:3000").then((res) => res.text()),
  ).resolves.toBe("Hello world!");
});

test("repro without colon", async () => {
  server.use(
    http.get("http://localhost*", () => HttpResponse.text("Hello world!")),
  );
  await expect(
    fetch("http://localhost:3000").then((res) => res.text()),
  ).resolves.toBe("Hello world!");
});
