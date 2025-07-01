import { API_BASE_URL } from "shared/api";
import { authFetch } from "shared/lib";

import type { UserActivityReward } from "../model/types";

export const getUserActivityReward = async (): Promise<
    (UserActivityReward | null)[]
> => {
    const response = await authFetch(`${API_BASE_URL}/activity-reward`, {
        method: "GET",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Failed to fetch progress");
    }

    return [...(await response.json())];
};

export const claimUserActivityReward = async (activityPoints: number) => {
    const response = await authFetch(`${API_BASE_URL}/activity-reward`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ activityPoints }),
    });

    if (!response.ok) {
        throw new Error("Failed to fetch activity reward");
    }
};
