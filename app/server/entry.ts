import express from "express";
import clientEntryUrl from "../client/entry.ts?url";
import htmlContent from "./template.html?raw";

export const app = express();

app.get("/", (_req, res) => {
  res
    .setHeader("content-type", "text/html")
    .end(
      htmlContent.replace(
        "</body>",
        `<script type="module" src="${clientEntryUrl}"></script></body>`,
      ),
    );
});

app.use(
  "/assets",
  express.static("dist/client/assets", {
    maxAge: "1y",
    immutable: true,
  }),
);

app.listen(3000, () => {
  console.log("Listening on http://localhost:3000");
});
