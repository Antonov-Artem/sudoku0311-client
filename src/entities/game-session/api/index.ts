import { API_BASE_URL } from "shared/api";
import { authFetch } from "shared/lib";

import type { GameSession } from "../model/types";

export const getGameSessionByUserId = async (
    userId: string,
): Promise<GameSession[] | null> => {
    const response = await authFetch(`${API_BASE_URL}/game-session/get`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
        throw new Error("Failed to fetch game session");
    }

    const data = await response.json();

    if (typeof data === "object" && data.length === 0) {
        return null;
    }

    return data;
};

export const createGameSession = async ({
    userId,
    difficulty,
}: {
    userId: string;
    difficulty: string;
}): Promise<GameSession> => {
    const response = await authFetch(`${API_BASE_URL}/game-session/create`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, difficulty }),
    });

    if (!response.ok) {
        throw new Error("Failed to fetch game session");
    }

    return response.json();
};

export const updateGameSession = async ({
    userId,
    updates,
}: {
    userId: string;
    updates: Partial<{
        currentBoard: number[][];
        score: number;
        time: number;
        errors: number;
    }>;
}): Promise<GameSession> => {
    const response = await authFetch(`${API_BASE_URL}/game-session/update`, {
        method: "PATCH",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, updates }),
    });

    if (!response.ok) {
        throw new Error("Failed to fetch game session");
    }

    return response.json();
};

export const deleteGameSession = async (
    sessionId: string,
): Promise<GameSession> => {
    const response = await authFetch(
        `${API_BASE_URL}/game-session/${sessionId}`,
        {
            method: "DELETE",
            credentials: "include",
        },
    );

    if (!response.ok) {
        throw new Error("Failed to fetch game session");
    }

    return response.json();
};
