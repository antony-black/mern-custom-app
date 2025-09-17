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
        targets: ["> 0.01%"], // Support for older browsers
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
        components: "/src/components",
        pages: "/src/pages",
        assets: "/src/assets",
        store: "/src/store",
        types: "/src/types",
        utils: "/src/utils",
        routes: "/src/routes",
        "@shared": path.resolve(__dirname, "../shared/src"),
      },
    },
    build: {
      chunkSizeWarningLimit: 800,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("pages/home-pages")) return "HomePage";
            if (id.includes("components/product-form")) return "ProductForm";
            if (id.includes("pages/create-page")) return "CreatePage";
            if (id.includes("pages/not-found-page")) return "NotFoundPage";
            if (id.includes("node_modules/react")) return "react";
            if (id.includes("node_modules/react-dom")) return "react-dom";
            if (id.includes("node_modules/react-router-dom")) return "router";
            if (id.includes("node_modules/zustand")) return "state";
            // if (id.includes("node_modules/@chakra-ui")) return "chakra";
            // if (id.includes("node_modules/@emotion")) return "chakra";
            // if (/node_modules\/(@chakra-ui|@emotion)\//.test(id)) return "chakra";
            if (id.includes("@chakra-ui")) return "chakra";
            if (id.includes("framer-motion")) return "motion";
            if (id.includes("node_modules/axios") || id.includes("node_modules/loglevel"))
              return "utils";
          },
        },
      },
    },
  };
});
