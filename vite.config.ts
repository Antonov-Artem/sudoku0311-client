import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";
import compression from "vite-plugin-compression";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        compression(),
        VitePWA({
            registerType: "autoUpdate",
            manifest: {
                name: "Sudoku 03.11",
                short_name: "sudoku0311",
                description:
                    "Unique sudoku about Armin Artlert with elements of gacha",
                theme_color: "#16a34a",
                icons: [
                    {
                        src: "/images/pwa-192x192.png",
                        sizes: "192x192",
                        type: "image/png",
                    },
                    {
                        src: "/images/pwa-512x512.png",
                        sizes: "512x512",
                        type: "image/png",
                    },
                ],
            },
        }),
    ],
    server: {
        allowedHosts: true,
    },
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
