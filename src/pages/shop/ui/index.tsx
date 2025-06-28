import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { clsx } from "clsx/lite";
import { getBalance } from "entities/balance";
import { getItemCategories } from "entities/inventory";
import { makePurchase } from "entities/purchase";
import { type ShopItem, getShopItems } from "entities/shop-item";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Button, Modal } from "shared/ui";
import { Header } from "widgets/header";

export const ShopPage = () => {
    const client = useQueryClient();

    const { data: balance } = useQuery({
        queryFn: getBalance,
        queryKey: ["balance-key"],
    });
    const { data: shopItems } = useQuery({
        queryKey: ["shop-item"],
        queryFn: getShopItems,
    });
    const { data: itemCategories } = useQuery({
        queryKey: ["item-categories"],
        queryFn: getItemCategories,
    });
    const purchaseMutation = useMutation({
        mutationFn: makePurchase,
        mutationKey: ["make-purchase"],
        onSuccess: () => {
            client.invalidateQueries({ queryKey: ["balance-key"] });
        },
    });

    const [purchaseModalVisible, setPurchaseModalVisible] = useState(false);
    const [menuModalVisible, setMenuModalVisible] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState(
        itemCategories && itemCategories[0].id,
    );
    const [selectedShopItem, setSelectedShopItem] = useState<ShopItem>();

    const [minQuantity, setMinQuantity] = useState(0);
    const [quantity, setQuantity] = useState(0);
    const [maxQuantity, setMaxQuantity] = useState(0);
    const [percentage, setPercentage] = useState(
        ((quantity - minQuantity) / (maxQuantity - minQuantity)) * 100,
    );
    const canMakePurchase =
        balance &&
        selectedShopItem &&
        selectedShopItem.priceInGems !== null &&
        balance.gems >= selectedShopItem.priceInGems;

    const togglePurchaseModal = (shopItem?: ShopItem) => {
        setSelectedShopItem(shopItem);
        setPurchaseModalVisible(!purchaseModalVisible);
    };

    const toggleMenuModal = () => {
        setMenuModalVisible(!menuModalVisible);
    };

    const declinePurchase = () => {
        togglePurchaseModal();
    };

    const confirmPurchase = (shopItemId: string, quantity: number) => {
        purchaseMutation.mutate({ shopItemId, quantity });
        togglePurchaseModal();
    };

    const selectCategory = (id: string) => {
        setSelectedCategoryId(id);
        toggleMenuModal();
    };

    useEffect(() => {
        if (!itemCategories) return;
        setSelectedCategoryId(itemCategories[0].id);
    }, [itemCategories]);

    useEffect(() => {
        const max =
            (balance &&
                selectedShopItem &&
                selectedShopItem.priceInGems &&
                balance.gems / selectedShopItem.priceInGems) ||
            0;

        const min = canMakePurchase ? 1 : 0;

        if (min === 1 && max === 1) {
            setMinQuantity(0);
            setMaxQuantity(1);
            setQuantity(1);
        } else {
            setMinQuantity(min);
            setMaxQuantity(max);
            setQuantity(min);
        }

        setPercentage(max === 1 ? 100 : ((quantity - min) / (max - min)) * 100);
    }, [balance, selectedShopItem]);

    return (
        <>
            <Header
                slot={
                    <div className="flex gap-1">
                        <div className="flex h-7 items-center rounded-full bg-yellow-100 px-3 font-medium text-yellow-700">
                            🪙 {balance?.gold}
                        </div>
                        <div className="flex h-7 items-center rounded-full bg-sky-100 px-3 font-medium text-sky-700">
                            💎 {balance?.gems}
                        </div>
                    </div>
                }
            />
            <div className="flex flex-col gap-6 px-4 pt-22 pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link to="/casino">
                            <Button className="flex size-10 items-center justify-center rounded-full border border-neutral-400 bg-white transition active:bg-neutral-200">
                                <span className="material-symbols-outlined mt-0.5 ml-2 text-xl!">
                                    arrow_back_ios
                                </span>
                            </Button>
                        </Link>
                        <div className="flex flex-col">
                            <h2 className="text-xl font-bold">Магазин</h2>
                            <p className="text-neutral-600">
                                {
                                    itemCategories?.find(
                                        item => item.id === selectedCategoryId,
                                    )?.name
                                }
                            </p>
                        </div>
                    </div>
                    <Button
                        className="flex size-10 items-center justify-center rounded-full border border-neutral-400 bg-white transition active:bg-neutral-200"
                        onClick={toggleMenuModal}
                    >
                        <span className="material-symbols-outlined text-xl!">
                            menu
                        </span>
                    </Button>
                </div>
                {shopItems?.find(
                    shopItem =>
                        shopItem.item.itemCategory.id === selectedCategoryId,
                ) ? (
                    <div className="grid grid-cols-2 gap-2">
                        {shopItems
                            ?.filter(
                                shopItem =>
                                    shopItem.item.itemCategory.id ===
                                    selectedCategoryId,
                            )
                            .map(shopItem => (
                                <div
                                    key={shopItem.id}
                                    className="grid aspect-square grid-rows-[1fr_auto] items-center rounded-xl bg-neutral-400 bg-linear-to-t from-black/10 to-transparent p-2 transition active:scale-[0.98]"
                                    onClick={() =>
                                        togglePurchaseModal(shopItem)
                                    }
                                >
                                    <div className="flex aspect-square items-center justify-center">
                                        <img
                                            src={shopItem.item.imageUrl}
                                            className="w-2/3"
                                        />
                                    </div>
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="flex flex-col items-center">
                                            <h4 className="text-base font-medium text-white">
                                                {shopItem.item.name}
                                            </h4>
                                            <p className="text-white/70">
                                                {
                                                    shopItem.item.itemCategory
                                                        .name
                                                }
                                            </p>
                                        </div>
                                        <div className="flex h-7 w-fit items-center justify-center rounded-full bg-sky-100 px-3 font-medium text-sky-800">
                                            {shopItem.priceInGold ? "🪙" : "💎"}{" "}
                                            {shopItem.priceInGems ||
                                                shopItem.priceInGold}
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                ) : (
                    <div className="flex h-[70vh] items-center justify-center">
                        В категории{" "}
                        <span className="font-bold">
                            "
                            {itemCategories &&
                                itemCategories.find(
                                    category =>
                                        category.id === selectedCategoryId,
                                )?.name}
                            "
                        </span>{" "}
                        нет предметов
                    </div>
                )}
            </div>
            <Modal open={purchaseModalVisible}>
                <div className="flex flex-col gap-4 p-4">
                    <div className="flex items-center gap-2">
                        <div className="flex size-10 items-center justify-center rounded-md bg-neutral-400">
                            <img
                                src={selectedShopItem?.item.imageUrl}
                                className="w-2/3"
                            />
                        </div>
                        <h3 className="text-xl font-bold">
                            {selectedShopItem?.item.name}
                        </h3>
                    </div>
                    <hr className="text-neutral-400" />
                    <p className="text-neutral-600">
                        {selectedShopItem?.item.name}
                    </p>
                    <p>
                        Количество:{" "}
                        <span className="font-medium">{quantity}</span>
                    </p>
                    <input
                        disabled={maxQuantity === 1}
                        min={minQuantity}
                        max={maxQuantity}
                        value={quantity}
                        onChange={e => {
                            setQuantity(Number(e.target.value));
                            setPercentage(
                                maxQuantity === 1
                                    ? 100
                                    : ((Number(e.target.value) - minQuantity) /
                                          (maxQuantity - minQuantity)) *
                                          100,
                            );
                        }}
                        type="range"
                        className="h-1.5 w-full appearance-none rounded-full bg-neutral-300 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:bg-green-600 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-600 [&::-webkit-slider-thumb]:shadow-md"
                        style={{
                            background: `linear-gradient(to right, oklch(62.7% 0.194 149.214) 0%, oklch(62.7% 0.194 149.214) ${percentage}%, oklch(87% 0 0) ${percentage}%, oklch(87% 0 0) 100%)`,
                        }}
                    />
                    <div className="w-full text-center font-medium">
                        {selectedShopItem?.priceInGold ? "🪙" : "💎"}{" "}
                        {quantity *
                            (selectedShopItem?.priceInGold ||
                                selectedShopItem?.priceInGems ||
                                0)}
                    </div>
                </div>
                <div className="flex justify-center gap-2 py-2">
                    <Button
                        className="h-8 rounded-full border border-neutral-400 bg-neutral-200 px-4 leading-none transition active:bg-neutral-300"
                        onClick={declinePurchase}
                    >
                        Отменить
                    </Button>
                    <Button
                        disabled={!canMakePurchase}
                        className={clsx(
                            "h-8 rounded-full bg-green-600 px-4 leading-none text-white transition disabled:opacity-70",
                            canMakePurchase && "active:bg-green-700",
                        )}
                        onClick={() => {
                            if (!selectedShopItem) return;
                            confirmPurchase(selectedShopItem.id, quantity);
                        }}
                    >
                        Подтвердить
                    </Button>
                </div>
            </Modal>
            <Modal open={menuModalVisible}>
                <div className="p-4">
                    <div className="flex w-full flex-col items-center">
                        <h2 className="text-2xl font-bold">Магазин</h2>
                        <p className="text-neutral-600">Категории</p>
                    </div>
                    <hr className="my-4 w-full text-neutral-400" />
                    <div className="flex w-full flex-col gap-2">
                        {itemCategories?.map(category => (
                            <div
                                key={category.id}
                                className={clsx(
                                    "flex h-12 w-full items-center justify-center rounded-xl font-medium transition",
                                    category.id === selectedCategoryId
                                        ? "bg-green-600 text-white active:bg-green-700"
                                        : "bg-white active:bg-neutral-200",
                                )}
                                onClick={() => selectCategory(category.id)}
                            >
                                {category.name}
                            </div>
                        ))}
                    </div>
                </div>
            </Modal>
        </>
    );
};
