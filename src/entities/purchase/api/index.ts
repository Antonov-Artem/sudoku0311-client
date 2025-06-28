import { authFetch } from "shared/lib";

export const makePurchase = async ({
    shopItemId,
    quantity,
}: {
    shopItemId: string;
    quantity: number;
}) => {
    const response = await authFetch(`http://localhost:3000/purchase`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ shopItemId, quantity }),
    });

    if (!response.ok) {
        throw new Error("Failed to fetch activity reward");
    }
};
