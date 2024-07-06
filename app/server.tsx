import express from "express";
import { renderToPipeableStream } from "react-dom/server";
import Home from "./Home.js";

const app = express();

app.get("/", (_, res) => {
  const { pipe } = renderToPipeableStream(<Home />, {
    onShellReady() {
      res.setHeader("Content-Type", "text/html");
      pipe(res);
    },
    onError(err) {
      console.error(err);
      res.status(500).send("Internal server error");
    },
  });
});

app.listen(3000, () => {
  console.log("Listening on http://localhost:3000");
});
