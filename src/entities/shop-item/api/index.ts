import type { ShopItem } from "../model/types";

export const getShopItems = async (): Promise<ShopItem[]> => {
    const response = await fetch("http://localhost:3000/shop-item", {
        method: "GET",
    });

    if (!response.ok) {
        throw new Error("Failed to fetch shop items");
    }

    return response.json();
};
