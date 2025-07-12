import { useMutation, useQuery } from "@tanstack/react-query";
import { clsx } from "clsx/lite";
import { getBalance, spentEnergy } from "entities/balance";
import {
    type GameSession,
    type SudokuDifficulty,
    createGameSession,
    deleteGameSession,
    getGameSessionByUserId,
} from "entities/game-session";
import { getProfile } from "entities/profile";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { BottomSheet } from "shared/ui";
import { Header } from "widgets/header";

const difficulties: { label: string; value: SudokuDifficulty }[] = [
    { label: "Легкий", value: "easy" },
    { label: "Средний", value: "medium" },
    { label: "Сложный", value: "hard" },
];

const energyCost: Record<SudokuDifficulty, number> = {
    easy: 10,
    medium: 25,
    hard: 50,
} as const;

export const HomePage = () => {
    const { data: balance } = useQuery({
        queryKey: ["balance-key"],
        queryFn: getBalance,
    });
    const { data: profile } = useQuery({
        queryKey: ["profile-key"],
        queryFn: getProfile,
    });
    const [difficulty, _] = useState<SudokuDifficulty>(
        difficulties[0].value as SudokuDifficulty,
    );
    const [canPlay, setCanPlay] = useState(false);
    const [gameSession, setGameSession] = useState<GameSession | null>(null);
    const [open, setOpen] = useState(false);

    const { mutateAsync: getGameSessionMutate } = useMutation({
        mutationKey: ["get-game-session"],
        mutationFn: getGameSessionByUserId,
        onSuccess: data => {
            if (!data || data.length === 0) {
                setGameSession(null);
                return;
            }
            setGameSession(data[0]);
            console.log(data[0]);
        },
    });

    const { mutateAsync: createGameSessionMutate } = useMutation({
        mutationKey: ["game-session"],
        mutationFn: createGameSession,
        onSuccess: data => {
            setGameSession(data);
            console.log(data);
        },
    });

    const { mutate: deleteGameSessionMutate } = useMutation({
        mutationKey: ["delete-game-session"],
        mutationFn: deleteGameSession,
    });

    const spentEnergyMutation = useMutation({
        mutationFn: spentEnergy,
        mutationKey: ["spent-energy"],
    });

    const handleGetGameSessionByUserId = async () => {
        if (!profile) return;
        await getGameSessionMutate(profile.userId);
    };

    useEffect(() => {
        handleGetGameSessionByUserId();
    }, [profile]);

    useEffect(() => {
        setCanPlay(
            balance !== undefined &&
                balance.energy > 0 &&
                energyCost[difficulty] <= balance.energy,
        );
    }, [balance, difficulty]);

    return (
        <>
            <Header
                slot={
                    <div className="relative flex h-7 items-center rounded-full bg-green-100 px-3 leading-none font-medium text-green-700">
                        🔋 {balance?.energy} / 300
                    </div>
                }
            />
            <div className="flex h-screen w-full flex-col items-center justify-center gap-2 px-4 py-20">
                {gameSession ? (
                    <>
                        <Link to="/game" className="w-2/3">
                            <button
                                className={clsx(
                                    "h-12 w-full rounded-full bg-green-600 px-4 text-base leading-0 font-medium text-white transition active:border-none active:bg-green-700 disabled:opacity-70",
                                )}
                            >
                                Продолжить игру
                            </button>
                        </Link>
                        <button
                            disabled={!canPlay}
                            className={clsx(
                                "h-12 w-2/3 rounded-full bg-neutral-300 px-4 text-base leading-0 font-medium transition active:border-none disabled:opacity-70",
                                canPlay && "active:bg-neutral-400",
                            )}
                            onClick={() => setOpen(true)}
                        >
                            Новая игра
                        </button>
                    </>
                ) : (
                    <button
                        disabled={!canPlay}
                        className={clsx(
                            "h-12 w-2/3 rounded-full bg-green-600 px-4 text-base leading-0 font-medium text-white transition active:border-none disabled:opacity-70",
                            canPlay && "active:bg-green-700",
                        )}
                        onClick={() => setOpen(true)}
                    >
                        Новая игра
                    </button>
                )}
            </div>
            <BottomSheet open={open} setOpen={setOpen}>
                <div className="flex w-full flex-col items-center gap-6">
                    <div className="flex flex-col items-center gap-1">
                        <h2 className="text-xl font-bold">Уровень сложности</h2>
                        <p className="text-neutral-600">
                            Выберите сложность, чтобы начать
                        </p>
                    </div>
                    <div className="flex w-full flex-col gap-2">
                        {difficulties.map(d => (
                            <Link
                                key={d.value}
                                to="/game"
                                onClick={async () => {
                                    if (!canPlay) return;
                                    deleteGameSessionMutate(
                                        gameSession?.id || "",
                                    );
                                    await createGameSessionMutate({
                                        difficulty: d.value,
                                        userId:
                                            localStorage.getItem("userId") ||
                                            "",
                                    });
                                    spentEnergyMutation.mutate(
                                        energyCost[d.value],
                                    );
                                }}
                            >
                                <button className="h-12 w-full rounded-full bg-neutral-300 text-base font-medium transition active:bg-neutral-400">
                                    {d.label}
                                </button>
                            </Link>
                        ))}
                    </div>
                </div>
            </BottomSheet>
        </>
    );
};
