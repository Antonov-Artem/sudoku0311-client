import { API_BASE_URL } from "shared/api";
import { authFetch } from "shared/lib";

import type { Balance } from "../model/types";

export const getBalance = async (): Promise<Balance> => {
    const response = await authFetch(`${API_BASE_URL}/balance`, {
        method: "GET",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Failed to fetch balance");
    }

    return response.json();
};

export const spentEnergy = async (energy: number) => {
    const response = await authFetch(`${API_BASE_URL}/balance/energy/spent`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ energy }),
    });

    if (!response.ok) {
        throw new Error("Failed to fetch activity reward");
    }
};
