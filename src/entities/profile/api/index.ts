import type { Profile } from "../model/types";
import { authFetch } from "shared/lib";

export const getProfile = async (): Promise<Profile> => {
    const response = await authFetch("http://localhost:3000/profile", {
        method: "GET",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Failed to fetch profile");
    }

    return response.json();
};
