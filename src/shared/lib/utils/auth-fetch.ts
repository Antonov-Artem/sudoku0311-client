import { API_BASE_URL } from "shared/api";

async function tryRefreshToken(): Promise<boolean> {
    const refreshToken = localStorage.getItem("refreshToken");
    const userId = localStorage.getItem("userId");

    if (!refreshToken || !userId) {
        return false;
    }

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken, userId }),
    });

    if (!response.ok) {
        return false;
    }

    const data = await response.json();

    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);

    return true;
}

export async function authFetch(
    input: RequestInfo,
    init: RequestInit = {},
): Promise<Response> {
    const accessToken = localStorage.getItem("accessToken");

    const authInit: RequestInit = {
        ...init,
        headers: {
            ...(init.headers || {}),
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
    };

    let response = await fetch(input, authInit);

    if (response.status === 401 || response.status === 403) {
        console.log("Access token expired, trying refresh...");

        const success = await tryRefreshToken();

        if (!success) {
            console.log("Refresh failed, redirecting to login.");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("userId");
            window.location.href = "/login";
            throw new Error("Could not refresh token");
        }

        const newAccessToken = localStorage.getItem("accessToken");

        response = await fetch(input, {
            ...authInit,
            headers: {
                ...(init.headers || {}),
                Authorization: `Bearer ${newAccessToken}`,
                "Content-Type": "application/json",
            },
        });
    }

    return response;
}
