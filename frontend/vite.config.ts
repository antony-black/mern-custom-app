import * as path from "node:path";

import legacy from "@vitejs/plugin-legacy";
import react from "@vitejs/plugin-react";
import autoprefixer from "autoprefixer";
import { defineConfig, loadEnv } from "vite";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      react(),
      svgr(),
      legacy({
        targets: ["> 0.01%"],
      }),
    ],
    server: {
      port: +env.PORT,
      proxy: {
        "/api": {
          target: "http://localhost:5000",
        },
      },
    },
    css: {
      postcss: {
        plugins: [autoprefixer({})],
      },
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
        "@shared": path.resolve(__dirname, "../shared/src"),
      },
    },
  };
});
