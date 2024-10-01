import {
  type Connect,
  type Plugin,
  type PluginOption,
  createServerModuleRunner,
  defineConfig,
} from "vite";

export default defineConfig({
  clearScreen: false,
  appType: "custom",
  plugins: [
    vitePluginSsrMiddleware({
      entry: "/src/entry-server",
      preview: new URL("./dist/server/index.js", import.meta.url).toString(),
    }),
    {
      name: "global-server",
      configureServer(server) {
        Object.assign(globalThis, { __globalServer: server });
      },
    },
  ],
  environments: {
    client: {
      build: {
        outDir: "dist/client",
      },
    },
    ssr: {
      build: {
        outDir: "dist/server",
        rollupOptions: {
          input: {
            index: "/src/entry-server",
          },
        },
      },
    },
  },
});

// vavite-style ssr middleware plugin
export function vitePluginSsrMiddleware({
  entry,
  preview,
}: {
  entry: string;
  preview?: string;
}): PluginOption {
  const plugin: Plugin = {
    name: vitePluginSsrMiddleware.name,

    async configureServer(server) {
      const runner = createServerModuleRunner(server.environments.ssr);
      const handler: Connect.NextHandleFunction = async (req, res, next) => {
        try {
          const mod = await runner.import(entry);
          await mod["default"](req, res, next);
        } catch (e) {
          next(e);
        }
      };
      return () => server.middlewares.use(handler);
    },

    async configurePreviewServer(server) {
      if (preview) {
        const mod = await import(preview);
        return () => server.middlewares.use(mod.default);
      }
      return;
    },

    hotUpdate({ modules, server }) {
      if (this.environment.name !== "ssr") return;
      for (const mod of modules) {
        if (mod.url === "/src/data.ts" || mod.url === "/src/entry-server.tsx") {
          return server.environments.client.hot.send({ type: "full-reload" });
        }
      }
    },
  };

  return [plugin];
}
