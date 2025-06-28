import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { clsx } from "clsx/lite";
import { getTickets, removeItem } from "entities/inventory";
import { increaseUserTaskProgress } from "entities/task";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { NavLink } from "react-router";
import { Header } from "widgets/header";

const banners = [
    {
        title: "Стандартный",
        rewards: [],
        image: "/images/banner-01.jpg",
        label: "Стандартный",
    },
    {
        title: "Персонажи",
        rewards: [],
        image: "/images/banner-02.jpg",
        label: "Персонажи",
    },
    {
        title: "Бустеры",
        rewards: [],
        image: "/images/banner-03.jpg",
        label: "Бустеры",
    },
    {
        title: "Косметика",
        rewards: [],
        image: "/images/banner-04.jpg",
        label: "Бустеры",
    },
    {
        title: "Премиум",
        rewards: [],
        image: "/images/banner-05.jpg",
        label: "Бустеры",
    },
];

export const CasinoPage = () => {
    const client = useQueryClient();

    const { data: tickets } = useQuery({
        queryKey: ["tickets"],
        queryFn: getTickets,
    });
    const increaseUserTaskProgressMutation = useMutation({
        mutationFn: increaseUserTaskProgress,
        mutationKey: ["increase-user-task-progress-key"],
        onSuccess: () => {
            client.invalidateQueries({ queryKey: ["user-tasks"] });
        },
    });
    const removeItemMutation = useMutation({
        mutationFn: removeItem,
        mutationKey: ["remove-item"],
        onSuccess: () => {
            client.invalidateQueries({ queryKey: ["tickets"] });
        },
    });
    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState(0);

    const prevBanner = () => {
        setDirection(-1);
        setCurrent(prev => (prev === 0 ? banners.length - 1 : prev - 1));
    };
    const nextBanner = () => {
        setDirection(1);
        setCurrent(prev => (prev === banners.length - 1 ? 0 : prev + 1));
    };

    const banner = banners[current];

    const onPullBannerClicked = () => {
        increaseUserTaskProgressMutation.mutate({
            type: "banner_pulled",
        });
        if (!tickets) return;
        removeItemMutation.mutate(tickets.id);
    };

    return (
        <div
            style={{ backgroundImage: `url(${banner.image})` }}
            className="bg-cover bg-center"
        >
            <div className="bg-black/35 backdrop-blur-xl">
                <Header
                    slot={
                        <div className="relative flex h-7 items-center rounded-full bg-pink-100 px-3 font-medium text-pink-700">
                            🎟️ {tickets?.quantity}
                        </div>
                    }
                />
                <div className="grid h-screen grid-rows-[auto_1fr] gap-4 px-4 pt-20 pb-22">
                    <div className="grid grid-cols-3">
                        <button
                            className={clsx(
                                "flex size-10 items-center justify-center rounded-full border border-neutral-400 bg-white transition disabled:opacity-60",
                                current === 0
                                    ? "cursor-not-allowed"
                                    : "active:bg-neutral-200",
                            )}
                            onClick={prevBanner}
                            disabled={current === 0}
                        >
                            <span className="material-symbols-outlined ml-2 text-xl!">
                                arrow_back_ios
                            </span>
                        </button>

                        <div className="flex flex-col items-center">
                            <p className="text-white/60">Баннеры</p>
                            <h1 className="text-base font-medium text-white">
                                {banner.title}
                            </h1>
                        </div>
                        <button
                            className={clsx(
                                "flex size-10 items-center justify-center justify-self-end rounded-full border border-neutral-400 bg-white transition disabled:opacity-60",
                                current === banners.length - 1
                                    ? "cursor-not-allowed"
                                    : "active:bg-neutral-200",
                            )}
                            onClick={nextBanner}
                            disabled={current === banners.length - 1}
                        >
                            <span className="material-symbols-outlined ml-1 text-xl!">
                                arrow_forward_ios
                            </span>
                        </button>
                    </div>
                    <div className="flex h-full flex-col gap-4">
                        <div className="relative flex h-full flex-col justify-end">
                            <AnimatePresence initial={false} custom={direction}>
                                <motion.div
                                    key={current}
                                    className="absolute inset-0 flex flex-col justify-end rounded-xl border border-white/50 bg-cover bg-center p-2 pb-0"
                                    style={{
                                        backgroundImage: `url(${banner.image})`,
                                    }}
                                    custom={direction}
                                    initial={{
                                        x: direction > 0 ? 300 : -300,
                                        opacity: 0,
                                    }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{
                                        x: direction > 0 ? -300 : 300,
                                        opacity: 0,
                                    }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 30,
                                    }}
                                >
                                    <div className="relative flex h-3/5 flex-col gap-2 rounded-xl rounded-b-none bg-linear-to-b from-white from-25% to-white/70 px-4 pt-10">
                                        <div className="absolute top-2 -left-1 rounded-tr-full rounded-br-full bg-sky-600 px-4 py-1 text-white">
                                            {banner.label}
                                        </div>
                                        <h2 className="text-2xl font-bold">
                                            {banner.title}
                                        </h2>
                                        <p>Из баннера можно получить:</p>
                                        <ul>
                                            {banner.rewards.map((reward, i) => (
                                                <li className="ml-4" key={i}>
                                                    - {reward}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                        <div className="flex justify-between">
                            <NavLink to="/shop">
                                <button className="flex size-9 items-center justify-center rounded-full border border-neutral-400 bg-white transition active:bg-neutral-200">
                                    <span className="material-symbols-outlined text-xl!">
                                        shopping_bag
                                    </span>
                                </button>
                            </NavLink>
                            <div className="flex gap-2">
                                <button
                                    disabled={tickets && tickets.quantity < 1}
                                    className={clsx(
                                        "flex h-9 items-center rounded-full border border-neutral-400 bg-white px-4 font-medium transition disabled:opacity-70",
                                        tickets &&
                                            tickets.quantity >= 1 &&
                                            "active:bg-neutral-200",
                                    )}
                                    onClick={onPullBannerClicked}
                                >
                                    Крутить: 🎟️ x 1
                                </button>
                                <button
                                    disabled={tickets && tickets.quantity < 10}
                                    className={clsx(
                                        "flex h-9 items-center rounded-full border border-neutral-400 bg-white px-4 font-medium transition disabled:opacity-70",
                                        tickets &&
                                            tickets.quantity >= 10 &&
                                            "active:bg-neutral-200",
                                    )}
                                >
                                    Крутить: 🎟️ x 10
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
