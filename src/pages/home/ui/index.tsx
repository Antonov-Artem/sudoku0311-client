import { useQuery } from "@tanstack/react-query";
import confetti from "canvas-confetti";
import { clsx } from "clsx/lite";
import { getBalance } from "entities/balance";
import { getProfile } from "entities/profile";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Header } from "widgets/header";

const difficulties = [
    { label: "Легкий", value: "easy" },
    { label: "Средний", value: "medium" },
    { label: "Сложный", value: "hard" },
];

export const HomePage = () => {
    const { data: balance } = useQuery({
        queryKey: ["balance-key"],
        queryFn: getBalance,
    });
    const { data: profile } = useQuery({
        queryKey: ["profile-key"],
        queryFn: getProfile,
    });
    const [difficulty, setDifficulty] = useState(difficulties[0].value);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const selected = difficulties.find(d => d.value === difficulty);

    const [show, setShow] = useState(true);

    useEffect(() => {
        const timer1 = setTimeout(() => {
            confetti({
                particleCount: 150,
                spread: 70,
                origin: {
                    y: 0.6,
                },
            });
        }, 500);

        const timer2 = setTimeout(() => {
            setShow(false);
        }, 3000);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, []);

    return (
        <>
            <AnimatePresence>
                {show && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="fixed top-0 left-0 z-50 flex h-screen w-screen flex-col items-center justify-center gap-10 bg-green-600"
                    >
                        <p className="w-1/2 text-center text-4xl leading-14 font-bold text-white">
                            С Днем Рождения!
                        </p>
                        <img
                            src="https://sdmntprpolandcentral.oaiusercontent.com/files/00000000-96f0-620a-a6e3-823cfe78e140/raw?se=2025-06-28T09%3A40%3A24Z&sp=r&sv=2024-08-04&sr=b&scid=4ebd968a-7034-58da-9724-ca1543fed38e&skoid=76024c37-11e2-4c92-aa07-7e519fbe2d0f&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-06-28T06%3A35%3A53Z&ske=2025-06-29T06%3A35%3A53Z&sks=b&skv=2024-08-04&sig=5wx/34RGnZ9Z9F%2BTAKYPhJ1wuYEIKcSgmZjLSEfRbq8%3D"
                            className="w-2/3 rounded-xl"
                        />
                    </motion.div>
                )}
            </AnimatePresence>
            {!show && (
                <>
                    <Header
                        slot={
                            <div className="relative flex h-7 items-center rounded-full bg-green-100 px-3 leading-none font-medium text-green-700">
                                🔋 {balance?.energy} / 300
                            </div>
                        }
                    />
                    <div className="flex flex-col gap-6 px-4 pt-20 pb-18">
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col gap-2">
                                    <h1 className="text-3xl font-bold">
                                        Привет, {profile?.userName}
                                    </h1>
                                    <p className="text-neutral-600">
                                        Выбери режим игры, чтобы начать
                                    </p>
                                </div>
                                <div className="flex h-[65vh] w-full flex-col items-center justify-between rounded-xl bg-neutral-500 bg-linear-to-t from-black/30 to-transparent p-4">
                                    <h1 className="text-2xl font-bold text-white">
                                        Классический судоку
                                    </h1>
                                    <div className="flex items-center gap-4">
                                        <p className="font-medium text-white">
                                            Уровень сложности:
                                        </p>
                                        <button
                                            className="relative z-10 flex h-8 w-28 items-center justify-center gap-1 rounded-full bg-white leading-none font-medium transition active:bg-neutral-200"
                                            onClick={() =>
                                                setDropdownOpen(v => !v)
                                            }
                                            type="button"
                                        >
                                            {selected?.label}
                                            <span
                                                className={clsx(
                                                    "material-symbols-outlined mt-0.5 text-lg! transition duration-300",
                                                    dropdownOpen
                                                        ? "rotate-180"
                                                        : "rotate-0",
                                                )}
                                            >
                                                keyboard_arrow_down
                                            </span>
                                            <AnimatePresence>
                                                {dropdownOpen && (
                                                    <motion.ul
                                                        initial={{
                                                            opacity: 0,
                                                            y: -10,
                                                        }}
                                                        animate={{
                                                            opacity: 1,
                                                            y: 0,
                                                        }}
                                                        exit={{
                                                            opacity: 0,
                                                            y: -10,
                                                        }}
                                                        transition={{
                                                            duration: 0.18,
                                                        }}
                                                        className="absolute bottom-10 left-0 z-20 w-28 rounded-xl bg-white p-2 shadow-lg ring-1 ring-black/10"
                                                    >
                                                        {difficulties.map(d => (
                                                            <li
                                                                key={d.value}
                                                                className={clsx(
                                                                    "cursor-pointer rounded-full py-3 text-center font-medium transition",
                                                                    difficulty ===
                                                                        d.value &&
                                                                        "bg-green-600 text-white",
                                                                )}
                                                                onClick={() =>
                                                                    setDifficulty(
                                                                        d.value,
                                                                    )
                                                                }
                                                            >
                                                                {d.label}
                                                            </li>
                                                        ))}
                                                    </motion.ul>
                                                )}
                                            </AnimatePresence>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <Link
                                to={`/game?difficulty=${difficulty}`}
                                className="w-full"
                            >
                                <button
                                    disabled={balance?.energy === 0}
                                    className={clsx(
                                        "h-12 w-full rounded-full bg-green-600 px-4 leading-0 font-medium text-white transition active:border-none disabled:opacity-70",
                                        balance &&
                                            balance.energy > 0 &&
                                            "active:bg-green-700",
                                    )}
                                >
                                    Играть
                                </button>
                            </Link>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};
