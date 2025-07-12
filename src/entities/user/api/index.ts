import { API_BASE_URL } from "shared/api";
import { authFetch } from "shared/lib";

export const register = async (
    email: string,
    password: string,
    name: string,
) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name }),
    });

    if (!response.ok) {
        throw new Error("Registration failed");
    }

    return response.json();
};

export async function login(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        throw new Error("Login failed");
    }

    const data = await response.json();

    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    localStorage.setItem("userId", data.userId);

    return data;
}

export async function logout() {
    await authFetch(`${API_BASE_URL}/auth/logout`, { method: "POST" });
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");
    window.location.href = "/login";
}
