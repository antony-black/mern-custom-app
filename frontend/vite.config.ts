import * as path from "node:path";

import legacy from "@vitejs/plugin-legacy";
import react from "@vitejs/plugin-react";
import autoprefixer from "autoprefixer";
// import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig, loadEnv } from "vite";
import svgr from "vite-plugin-svgr";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      react(),
      // visualizer({
      //   filename: "dist/stats.html",
      //   open: true,
      //   gzipSize: true,
      //   brotliSize: true,
      // }),
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
    // build: {
    //   chunkSizeWarningLimit: 1000,
    //   rollupOptions: {
    //     output: {
    //       manualChunks(id) {
    //         if (
    //           id.includes("node_modules/react") ||
    //           id.includes("node_modules/react-dom") ||
    //           id.includes("framer-motion") ||
    //           id.includes("@chakra-ui") ||
    //           id.includes("@emotion")
    //         ) {
    //           return "react-motion-chakra";
    //         }
    //         if (id.includes("node_modules/zustand")) return "zustand";
    //         if (id.includes("axios") || id.includes("loglevel")) return "utils";
    //       },
    //     },
    //   },
    // },

    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (
              id.includes("node_modules/react") ||
              id.includes("node_modules/react-dom") ||
              id.includes("framer-motion") ||
              id.includes("@chakra-ui") ||
              id.includes("@emotion")
            ) {
              return "react-motion-chakra";
            }
            if (id.includes("node_modules/zustand")) return "zustand";
            if (id.includes("axios") || id.includes("loglevel")) return "utils";
          },
          chunkFileNames: (chunkInfo) => {
            if (chunkInfo.facadeModuleId) {
              const relPath = path.relative(process.cwd(), chunkInfo.facadeModuleId);
              const parsed = path.parse(relPath);
              const folders = parsed.dir.split(path.sep);
              const folderName = folders[folders.length - 1];
              const baseName = parsed.name === "index" ? folderName : parsed.name;

              return `assets/${baseName}-[hash].js`;
            }
            return "assets/[name]-[hash].js";
          },
        },
      },
    },
  };
});
