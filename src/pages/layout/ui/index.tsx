import { AnimatePresence, motion } from "motion/react";
import { Outlet, useLocation } from "react-router";
import { BottomBar } from "widgets/bottom-bar";

import { menu } from "../config/menu";
import type { LayoutProps } from "../model/types.ts";

export const Layout = ({ bottomBar = false }: LayoutProps) => {
    const location = useLocation();

    const pageTransition = {
        initial: { opacity: 0.75 },
        animate: { opacity: 1 },
        transition: { duration: 0.25, ease: "linear" },
    };

    return (
        <>
            <main className="overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        variants={pageTransition}
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
            </main>
            {bottomBar && <BottomBar items={menu} />}
        </>
    );
};
