import express from "express";
import { renderToPipeableStream } from "react-dom/server";
import { Transform } from "node:stream";
import stylesUrl from "./styles.css?url";

export const app = express();

app.get("/", (req, res) => {
  const { pipe } = renderToPipeableStream(
    <html>
      <head>
        <title>Propagating asset updates to CSS | Avoiding FOUC</title>
        <link rel="stylesheet" href={stylesUrl} />
      </head>
      <body>{/* a lot of awesome content */}</body>
    </html>,
    {
      onShellReady() {
        if (import.meta.env.DEV) {
          const viteDevStream = new Transform({
            async transform(chunk, _encoding, callback) {
              const modified = await __viteDevServer.transformIndexHtml(
                req.originalUrl,
                chunk.toString(),
              );
              callback(null, modified);
            },
          });
          pipe(viteDevStream).pipe(res);
        } else {
          pipe(res);
        }
      },
    },
  );
});

if (import.meta.env.PROD) {
  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
}
