import { API_BASE_URL } from "shared/api";

import type { ShopItem } from "../model/types";

export const getShopItems = async (): Promise<ShopItem[]> => {
    const response = await fetch(`${API_BASE_URL}/shop-item`, {
        method: "GET",
    });

    if (!response.ok) {
        throw new Error("Failed to fetch shop items");
    }

    return response.json();
};
