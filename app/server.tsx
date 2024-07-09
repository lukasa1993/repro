import express from "express";
import compression from "compression";
import morgan from "morgan";
import { renderToPipeableStream } from "react-dom/server";

const isDev = process.env.NODE_ENV === "development";

const app = express();

app.use(compression());

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable("x-powered-by");

if (isDev) {
  const [webpack, devMiddleware, hotMiddleware, config] = await Promise.all([
    import("webpack").then((mod) => mod.default),
    import("webpack-dev-middleware").then((mod) => mod.default),
    import("webpack-hot-middleware").then((mod) => mod.default),
    import("../webpack.config.js").then((mod) => mod.default),
  ]);
  const compiler = webpack(config);
  app.use(devMiddleware(compiler));
  app.use(hotMiddleware(compiler));
} else {
  app.use(
    "/assets",
    express.static("dist/client/assets", { immutable: true, maxAge: "1y" }),
  );
}

app.use(express.static(isDev ? "public" : "dist/client", { maxAge: "1h" }));

app.get("/", (_, res) => {
  let statusCode = 200;
  let shellReady = false;
  const { pipe } = renderToPipeableStream(
    <h1 className="text-5xl">Hello World</h1>,
    {
      onShellReady() {
        shellReady = true;
        res.status(statusCode).setHeader("Content-Type", "text/html");
        pipe(res);
      },
      onError(err) {
        statusCode = 500;
        if (shellReady) {
          console.error(err);
        }
      },
    },
  );
});

app.use(morgan("tiny"));

app.listen(3000, () => {
  console.log("Listening on http://localhost:3000");
});
