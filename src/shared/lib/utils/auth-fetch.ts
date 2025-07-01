import { API_BASE_URL } from "shared/api";

let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

async function refreshToken(userId: string) {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
        throw new Error("Refresh failed");
    }
}

export async function authFetch(
    input: RequestInfo,
    init?: RequestInit,
): Promise<Response> {
    let response = await fetch(input, { ...init, credentials: "include" });

    if (response.status === 401 || response.status === 403) {
        const userId = localStorage.getItem("userId");

        if (!userId) {
            window.location.href = "/login";
            throw new Error("No userId found");
        }

        if (!isRefreshing) {
            isRefreshing = true;
            refreshPromise = refreshToken(userId).finally(() => {
                isRefreshing = false;
            });
        }
        try {
            await refreshPromise;
            response = await fetch(input, { ...init, credentials: "include" });
        } catch (e) {
            window.location.href = "/login";
            console.log(e);
            throw e;
        }
    }

    return response;
}
