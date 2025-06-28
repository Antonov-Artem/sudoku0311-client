export type InventoryItem = {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    itemCategory: {
        id: string;
        name: string;
    } | null;
    rarity: {
        name: string;
    } | null;
    quantity: number;
};

export type ItemCategory = {
    id: Id;
    name: string;
};
