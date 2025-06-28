import { useQuery } from "@tanstack/react-query";
import { clsx } from "clsx/lite";
import { getBalance } from "entities/balance";
import { getInventory, getItemCategories } from "entities/inventory";
import { useEffect, useState } from "react";
import { Modal } from "shared/ui";
import { Header } from "widgets/header";

export const InventoryPage = () => {
    const { data: balance } = useQuery({
        queryFn: getBalance,
        queryKey: ["balance-key"],
    });
    const { data: inventory } = useQuery({
        queryKey: ["inventory"],
        queryFn: getInventory,
    });
    const { data: itemCategories } = useQuery({
        queryKey: ["item-categories"],
        queryFn: getItemCategories,
    });
    const [menuModalVisible, setMenuModalVisible] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>();

    const toggleMenuModal = () => {
        setMenuModalVisible(!menuModalVisible);
    };

    const selectCategory = (index: string) => {
        setSelectedCategoryId(index);
        toggleMenuModal();
    };

    useEffect(() => {
        if (!itemCategories) return;

        setSelectedCategoryId(itemCategories[0].id);
    }, [itemCategories]);

    return (
        <>
            <Header
                slot={
                    <div className="flex gap-1">
                        <div className="relative flex h-7 items-center rounded-full bg-yellow-100 px-3 font-medium text-yellow-700">
                            🪙 {balance?.gold}
                        </div>
                        <div className="relative flex h-7 items-center rounded-full bg-sky-100 px-3 font-medium text-sky-700">
                            💎 {balance?.gems}
                        </div>
                    </div>
                }
            />
            <div className="flex min-h-screen flex-col gap-6 px-4 pt-22 pb-22">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            className="flex size-10 items-center justify-center rounded-full border border-neutral-400 bg-white transition active:bg-neutral-200"
                            onClick={toggleMenuModal}
                        >
                            <span className="material-symbols-outlined text-xl!">
                                menu
                            </span>
                        </button>
                        <div>
                            <h1 className="text-xl font-bold">Инвентарь</h1>
                            <p className="text-neutral-600">
                                {
                                    itemCategories?.find(
                                        category =>
                                            category.id === selectedCategoryId,
                                    )?.name
                                }
                            </p>
                        </div>
                    </div>
                    <button className="flex size-10 items-center justify-center rounded-full border border-neutral-400 bg-white transition active:bg-neutral-200">
                        <span className="material-symbols-outlined text-xl!">
                            filter_list
                        </span>
                    </button>
                </div>
                {inventory?.find(
                    item => item.itemCategory?.id === selectedCategoryId,
                ) ? (
                    <div className="grid grid-cols-4 gap-2">
                        {inventory
                            ?.filter(
                                item =>
                                    item.itemCategory?.id ===
                                    selectedCategoryId,
                            )
                            .map(item => (
                                <div
                                    key={item.id}
                                    className={clsx(
                                        "relative flex aspect-square flex-col items-center justify-center rounded-xl transition active:scale-[0.98]",
                                        item.rarity?.name === "Легендарный" &&
                                            "bg-black/50 bg-linear-to-t from-yellow-400/40 to-black/50",
                                    )}
                                >
                                    <img
                                        src={item.imageUrl}
                                        className="w-2/3"
                                    />
                                    <p className="absolute right-2 bottom-2 font-bold text-white text-shadow-2xs">
                                        {item.quantity}
                                    </p>
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
            <Modal open={menuModalVisible}>
                <div className="p-4">
                    <div className="flex w-full flex-col items-center">
                        <h2 className="text-2xl font-bold">Инвентарь</h2>
                        <p className="text-neutral-600">Категории</p>
                    </div>
                    <hr className="my-4 w-full text-neutral-400" />
                    <div className="flex w-full flex-col gap-2">
                        {itemCategories?.map(category => (
                            <button
                                key={category.name}
                                className={clsx(
                                    "flex h-12 w-full items-center justify-center rounded-xl font-medium transition",
                                    category.id === selectedCategoryId
                                        ? "bg-green-600 text-white active:bg-green-700"
                                        : "bg-white active:bg-neutral-200",
                                )}
                                onClick={() => selectCategory(category.id)}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>
            </Modal>
        </>
    );
};
