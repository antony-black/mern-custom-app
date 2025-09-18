// import * as path from "node:path";

// // import legacy from "@vitejs/plugin-legacy";
// import react from "@vitejs/plugin-react";
// import autoprefixer from "autoprefixer";
// import { visualizer } from "rollup-plugin-visualizer";
// import { defineConfig, loadEnv } from "vite";
// import svgr from "vite-plugin-svgr";

// export default defineConfig(({ mode }) => {
//   const env = loadEnv(mode, process.cwd(), "");

//   return {
//     plugins: [
//       react(),
//       visualizer({
//         filename: "dist/stats.html",
//         open: true, // will auto-open in browser after build
//         gzipSize: true,
//         brotliSize: true,
//       }),
//       svgr(),
//       // legacy({
//       //   targets: ["> 0.01%"], // Support for older browsers
//       // }),
//     ],
//     server: {
//       port: +env.PORT,
//       proxy: {
//         "/api": {
//           target: "http://localhost:5000",
//         },
//       },
//     },
//     css: {
//       postcss: {
//         plugins: [autoprefixer({})],
//       },
//     },
//     resolve: {
//       alias: {
//         components: "/src/components",
//         pages: "/src/pages",
//         assets: "/src/assets",
//         store: "/src/store",
//         types: "/src/types",
//         utils: "/src/utils",
//         routes: "/src/routes",
//         "@shared": path.resolve(__dirname, "../shared/src"),
//       },
//     },
//     build: {
//       chunkSizeWarningLimit: 800,
//       rollupOptions: {
//         output: {
//           manualChunks(id) {
//             if (id.includes("node_modules/zustand")) return "state";
//             if (id.includes("@chakra-ui") || id.includes("@emotion")) return "chakra";
//             if (id.includes("framer-motion")) return "motion";
//             if (id.includes("axios") || id.includes("loglevel")) return "utils";

//             // if (id.includes("pages/home-pages")) return "HomePage";
//             // if (id.includes("components/product-form")) return "ProductForm";
//             // if (id.includes("pages/create-page")) return "CreatePage";
//           },
//         },
//       },
//     },
//   };
// });
// vite.config.js
import * as path from "node:path";
import legacy from "@vitejs/plugin-legacy";
import react from "@vitejs/plugin-react";
import autoprefixer from "autoprefixer";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig, loadEnv } from "vite";
import svgr from "vite-plugin-svgr";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      react(),
      visualizer({
        filename: "dist/stats.html",
        open: true,
        gzipSize: true,
        brotliSize: true,
      }),
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
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            // A dedicated chunk for React and its core dependencies
            if (id.includes("node_modules/react") || id.includes("node_modules/react-dom")) {
              return "vendor-react";
            }
            // The rest of your chunking logic can go here, e.g.:
            if (id.includes("node_modules/framer-motion")) {
              return "vendor-motion";
            }
          },
        },
      },
    },
  };
});
