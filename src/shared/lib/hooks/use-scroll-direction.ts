import { useEffect, useRef, useState } from "react";

const threshold = 25;

export const useScrollDirection = () => {
    const [scrollDirection, setScrollDirection] = useState<"up" | "down">("up");
    const lastScrollY = useRef(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            const diff = Math.abs(currentScrollY - lastScrollY.current);

            if (diff > threshold) {
                if (currentScrollY > lastScrollY.current) {
                    setScrollDirection("down");
                } else if (currentScrollY < lastScrollY.current) {
                    setScrollDirection("up");
                }
                lastScrollY.current = currentScrollY;
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, [threshold]);

    return scrollDirection;
};
