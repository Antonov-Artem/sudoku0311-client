import compression from "vite-plugin-compression";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import tailwindcss from "@tailwindcss/vite";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        compression(),
        visualizer({ open: true }),
    ],
    resolve: {
        alias: {
            app: resolve(__dirname, "./src/app"),
            pages: resolve(__dirname, "./src/pages"),
            widgets: resolve(__dirname, "./src/widgets"),
            entities: resolve(__dirname, "./src/entities"),
            shared: resolve(__dirname, "./src/shared"),
        },
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    react: ["react", "react-dom"],
                    query: ["@tanstack/react-query"],
                    motion: ["motion"],
                },
            },
        },
    },
});
