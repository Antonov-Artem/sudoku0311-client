import { API_BASE_URL } from "shared/api";
import { authFetch } from "shared/lib";

import type { Profile } from "../model/types";

export const getProfile = async (): Promise<Profile> => {
    const response = await authFetch(`${API_BASE_URL}/profile`, {
        method: "GET",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Failed to fetch profile");
    }

    return response.json();
};
