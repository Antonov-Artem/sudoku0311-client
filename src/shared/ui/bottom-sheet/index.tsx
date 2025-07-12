import { AnimatePresence, motion } from "motion/react";
import { useRef } from "react";
import { createPortal } from "react-dom";
import { useClickAway, useLockBodyScroll } from "react-use";

import type { BottomSheetProps } from "./types.ts";

const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
};

const modalVariants = {
    hidden: { y: 400 },
    visible: { y: 0 },
    exit: { y: 400 },
};

export const BottomSheet = ({ open, setOpen, children }: BottomSheetProps) => {
    useLockBodyScroll(open);

    const bottomSheetRef = useRef<HTMLDivElement>(null);

    useClickAway(bottomSheetRef, () => setOpen(false));

    return createPortal(
        <AnimatePresence>
            {open && (
                <motion.div
                    variants={backdropVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="fixed top-0 left-0 z-40 h-full w-full bg-black/50 backdrop-blur-sm"
                >
                    <motion.div
                        ref={bottomSheetRef}
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ ease: "circOut" }}
                        className="fixed bottom-0 left-1/2 z-50 flex w-11/12 -translate-x-1/2 flex-col items-center rounded-t-xl bg-white px-6 pt-4 pb-10"
                    >
                        <div className="mb-10 h-[4px] w-10 rounded-full bg-neutral-400" />
                        {children}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.getElementById("portal")!,
    );
};
