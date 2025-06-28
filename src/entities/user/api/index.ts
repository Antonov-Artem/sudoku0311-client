import type { User } from "../model/types";

export const register = async (
    email: string,
    password: string,
    name: string,
) => {
    const response = await fetch("http://localhost:3000/auth/register", {
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

export const login = async (email: string, password: string): Promise<User> => {
    const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        throw new Error("Login failed");
    }

    const res = await (response.json() as Promise<User>);

    localStorage.setItem("userId", res.userId);

    return res;
};

export const logout = async (userId?: string) => {
    const response = await fetch("http://localhost:3000/auth/logout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
        throw new Error("Logout failed");
    }

    localStorage.removeItem("userId");
};
