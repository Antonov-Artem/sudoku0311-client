import { useQuery } from "@tanstack/react-query";
import { getProfile } from "entities/profile";
import { motion } from "motion/react";
import { Link } from "react-router";
import { useScrollAtBottom, useScrollDirection } from "shared/lib";

import type { HeaderProps } from "../model/types";

export const Header = ({ slot }: HeaderProps) => {
    const { data: profile } = useQuery({
        queryKey: ["profile-key"],
        queryFn: getProfile,
    });
    const scrollDirection = useScrollDirection();
    const atBottom = useScrollAtBottom();
    const show = scrollDirection === "up" || atBottom;

    return (
        <motion.header
            animate={{ y: show ? 0 : -100, opacity: show ? 1 : 0 }}
            transition={{ duration: 0.25 }}
            className="fixed top-2 left-1/2 z-40 flex h-14 w-[calc(100vw-16px)] -translate-x-1/2 items-center justify-between rounded-full border border-neutral-400 bg-white px-3 shadow-lg"
        >
            <Link to="/profile">
                <div className="flex items-center gap-2">
                    <div className="size-8 rounded-full bg-indigo-700" />
                    <p className="text-base font-medium">{profile?.userName}</p>
                </div>
            </Link>
            {slot}
        </motion.header>
    );
};
