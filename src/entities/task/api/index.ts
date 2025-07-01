import { API_BASE_URL } from "shared/api";
import { authFetch } from "shared/lib";

import type { UserTask } from "../model/types";

export const getUserTasks = async (): Promise<UserTask[]> => {
    const response = await authFetch(`${API_BASE_URL}/task`, {
        method: "GET",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Failed to fetch progress");
    }

    return response.json();
};

export const increaseUserTaskProgress = async ({
    type,
    progress = 1,
}: {
    type: string;
    progress?: number;
}) => {
    const response = await authFetch(`${API_BASE_URL}/task/set`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ type, progress }),
    });

    if (!response.ok) {
        throw new Error("Failed to fetch progress");
    }

    return response.json();
};

export const claimUserTaskActivityPoints = async (userTaskId: string) => {
    const response = await authFetch(`${API_BASE_URL}/task/claim`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ userTaskId }),
    });

    if (!response.ok) {
        throw new Error("Failed to fetch progress");
    }

    const text = await response.text();

    return text ? JSON.parse(text) : null;
};
