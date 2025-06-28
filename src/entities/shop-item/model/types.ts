export type ShopItem = {
    id: string;
    priceInGold: number | null;
    priceInGems: number | null;
    item: {
        id: string;
        name: string;
        imageUrl: string;
        itemCategory: {
            id: string;
            name: string;
        };
        rarity: {
            id: string;
            name: string;
        };
    };
};
