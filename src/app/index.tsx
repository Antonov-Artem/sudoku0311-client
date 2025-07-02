import { QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { client } from "shared/api";

import { router } from "./router.tsx";

const root = document.querySelector("#root")!;

createRoot(root).render(
    <QueryClientProvider client={client}>
        <Suspense
            fallback={
                <div className="flex h-screen items-center justify-center">
                    Loading...
                </div>
            }
        >
            <RouterProvider router={router} />
        </Suspense>
    </QueryClientProvider>,
);

console.log("MODE:", import.meta.env.MODE);
console.log("API_BASE_URL:", import.meta.env.VITE_API_BASE_URL);
