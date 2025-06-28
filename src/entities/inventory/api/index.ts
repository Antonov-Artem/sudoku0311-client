import { authFetch } from "shared/lib";

import type { InventoryItem, ItemCategory } from "../model/types";

export const getInventory = async (): Promise<InventoryItem[]> => {
    const response = await authFetch("http://localhost:3000/inventory", {
        method: "GET",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Failed to fetch progress");
    }

    return response.json();
};

export const getItemCategories = async (): Promise<ItemCategory[]> => {
    const response = await authFetch(
        "http://localhost:3000/inventory/categories",
        {
            method: "GET",
            credentials: "include",
        },
    );

    if (!response.ok) {
        throw new Error("Failed to fetch progress");
    }

    return response.json();
};

export const getTickets = async (): Promise<{
    id: string;
    quantity: number;
}> => {
    const response = await authFetch(
        "http://localhost:3000/inventory/tickets",
        {
            method: "GET",
            credentials: "include",
        },
    );

    if (!response.ok) {
        throw new Error("Failed to fetch progress");
    }

    return response.json();
};

export const removeItem = async (inventoryItemId: string) => {
    const response = await authFetch("http://localhost:3000/inventory", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ inventoryItemId }),
    });

    if (!response.ok) {
        throw new Error("Failed to fetch progress");
    }
};
