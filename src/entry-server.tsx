import { renderToString } from "react-dom/server";
import type { Connect, ViteDevServer } from "vite";
import Root from "./root";
import Data from "./data";

if (!Data.singleton.value) {
  await Data.singleton.fetch();
}

const handler: Connect.NextHandleFunction = async (_req, res) => {
  if (!Data.singleton.value) throw new Error("Data is missing");
  const ssrHtml = renderToString(<Root />);
  let html = await importHtml();
  html = html.replace(/<body>/, `<body><div id="root">${ssrHtml}</div>`);
  res.setHeader("content-type", "text/html").end(html);
};

export default handler;

declare let __globalServer: ViteDevServer;

async function importHtml() {
  if (import.meta.env.DEV) {
    const mod = await import("/index.html?raw");
    return __globalServer.transformIndexHtml("/", mod.default);
  } else {
    const mod = await import("/dist/client/index.html?raw");
    return mod.default;
  }
}
