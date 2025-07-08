import { useQuery } from "@tanstack/react-query";
import { clsx } from "clsx/lite";
import { getUserActivityReward } from "entities/activity-reward";
import { getBalance } from "entities/balance";
import { getUserTasks } from "entities/task";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import { useScrollAtBottom, useScrollDirection } from "shared/lib";

import type { BottomBarProps } from "../model/types";

export const BottomBar = ({ items }: BottomBarProps) => {
    const { data: balance } = useQuery({
        queryKey: ["balance-key"],
        queryFn: getBalance,
    });
    const { data: userTasks } = useQuery({
        queryKey: ["user-tasks"],
        queryFn: getUserTasks,
    });
    const { data: userActivityRewards } = useQuery({
        queryKey: ["user-activity-reward"],
        queryFn: getUserActivityReward,
    });

    const [tasksMissed, setTasksMissed] = useState(false);
    const [canPlay, setCanPlay] = useState(false);
    const scrollDirection = useScrollDirection();
    const atBottom = useScrollAtBottom();

    const show = scrollDirection === "up" || atBottom;

    useEffect(() => {
        if (!userTasks || !userActivityRewards) {
            setTasksMissed(false);
            return;
        }
        const hasMissed =
            userTasks.some(t => t.isCompleted && !t.isClaimed) &&
            userActivityRewards.some(r => !r?.claimed);
        setTasksMissed(hasMissed);
    }, [userTasks]);

    useEffect(() => {
        setCanPlay(balance !== undefined && balance.energy >= 10);
    }, [balance]);

    return (
        <motion.nav
            animate={{ y: show ? 0 : 100, opacity: show ? 1 : 0 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-2 left-1/2 flex h-16 w-[calc(100vw-16px)] -translate-x-1/2 items-center justify-center gap-8 rounded-full border border-neutral-400 bg-white shadow-lg"
        >
            {items.map((menuItem, i) => (
                <NavLink
                    key={menuItem.key}
                    to={!canPlay && i === 2 ? "/" : menuItem.path}
                    className={({ isActive }) =>
                        clsx(
                            "relative flex size-10 items-center justify-center rounded-full transition",
                            isActive && "text-green-700",
                            i === 2
                                ? "bg-green-600 text-white"
                                : "active:bg-neutral-200",
                            (isActive || i === 2) && "fill",
                            !canPlay && i === 2 && "opacity-70",
                        )
                    }
                >
                    <span className="material-symbols-outlined">
                        {menuItem.icon}
                    </span>
                    {i === 1 && tasksMissed && (
                        <div className="absolute top-1 right-1 size-3 rounded-full border-3 border-white bg-red-500" />
                    )}
                </NavLink>
            ))}
        </motion.nav>
    );
};
