import { useEffect, useState } from "react";

export function useScrollAtBottom(threshold: number = 2): boolean {
    const [atBottom, setAtBottom] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setAtBottom(
                window.innerHeight + window.scrollY >=
                    document.body.offsetHeight - threshold,
            );
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
    }, [threshold]);

    return atBottom;
}
