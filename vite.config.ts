import {
  defineConfig,
  isRunnableDevEnvironment,
  type ViteDevServer,
  type Connect,
} from "vite";
import assert from "node:assert";

declare global {
  var __viteDevServer: ViteDevServer;
}

export default defineConfig({
  appType: "custom",
  clearScreen: false,
  plugins: [
    {
      name: "dev",
      apply: "serve",
      async configureServer(server) {
        globalThis.__viteDevServer = server;
        const handler: Connect.NextHandleFunction = async (req, res, next) => {
          try {
            assert(isRunnableDevEnvironment(server.environments.ssr));
            const { app } =
              await server.environments.ssr.runner.import<
                typeof import("./server")
              >("./server");
            app(
              // @ts-expect-error: Connect and Express request types are not compatible
              req,
              res,
              next,
            );
          } catch (err) {
            next(err);
          }
        };
        return () => {
          server.middlewares.use(handler);
        };
      },
    },
  ],
  environments: {
    client: {
      build: {
        outDir: "dist/client",
        rollupOptions: {
          input: "./styles.css",
        },
      },
    },
    ssr: {
      build: {
        outDir: "dist/server",
        rollupOptions: {
          input: "./server.tsx",
        },
      },
    },
  },
});
