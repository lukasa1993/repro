import { defineConfig, isRunnableDevEnvironment, type Connect } from "vite";
import assert from "node:assert";

export default defineConfig({
  plugins: [
    {
      name: "dev",
      async configureServer(server) {
        assert(
          isRunnableDevEnvironment(server.environments.ssr),
          "SSR is not a runnable environment",
        );
        const handler: Connect.NextHandleFunction = async (req, res, next) => {
          try {
            assert(
              isRunnableDevEnvironment(server.environments.ssr),
              "SSR is not a runnable environment",
            );
            const { app } = await server.environments.ssr.runner.import(
              "./app/server/entry.ts",
            );
            app(req, res, next);
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
  appType: "custom",
  clearScreen: false,
  server: {
    port: 3000,
  },
  environments: {
    client: {
      build: {
        outDir: "dist/client",
        rollupOptions: {
          input: "app/client/entry.ts",
        },
      },
    },
    ssr: {
      build: {
        assetsInlineLimit: () => false,
        outDir: "dist/server",
        rollupOptions: {
          input: "app/server/entry.ts",
        },
      },
    },
  },
  builder: {
    async buildApp(builder) {
      await builder.build(builder.environments.client);
      await builder.build(builder.environments.ssr);
    },
  },
});
