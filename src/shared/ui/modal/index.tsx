import { AnimatePresence, motion } from "motion/react";
import { createPortal } from "react-dom";
import { useLockBodyScroll } from "react-use";

import type { ModalProps } from "./types.ts";

const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
};

const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
};

export const Modal = ({ open, children }: ModalProps) => {
    useLockBodyScroll(open);

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
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="fixed top-1/2 left-1/2 z-50 w-10/12 -translate-1/2 rounded-xl bg-white"
                    >
                        {children}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.getElementById("portal")!,
    );
};
