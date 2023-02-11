import { defineConfig } from "vite";
import paths from "vite-tsconfig-paths";
import { viteCommonjs } from "@originjs/vite-plugin-commonjs";
import react from "@vitejs/plugin-react";

export default defineConfig({
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  plugins: [
    react({
      jsxImportSource: "@emotion/react",
      babel: {
        plugins: ["@emotion/babel-plugin"],
      },
    }),
    viteCommonjs({
      include: ["tailwind.config.js"],
      exclude: [],
      skipPreBuild: false,
    }),
    paths(),
  ],
  server: {
    port: 3000,
  },
  publicDir: "assets",
});
