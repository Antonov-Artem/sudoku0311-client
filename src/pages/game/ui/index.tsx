import { useMutation } from "@tanstack/react-query";
import { clsx } from "clsx/lite";
import {
    type GameSession,
    deleteGameSession,
    getGameSessionByUserId,
    updateGameSession,
} from "entities/game-session";
import { increaseUserTaskProgress } from "entities/task";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Modal } from "shared/ui";

const MAX_LIVES = 3;

const difficulties = {
    easy: "Легкий",
    medium: "Средний",
    hard: "Сложный",
} as const;

export const GamePage = () => {
    const navigate = useNavigate();
    const [gameSession, setGameSession] = useState<GameSession>();

    const { mutateAsync: getGameSessionMutate, isSuccess } = useMutation({
        mutationKey: ["get-game-session"],
        mutationFn: getGameSessionByUserId,
        onSuccess: data => {
            if (!data || data.length === 0) {
                setGameSession(undefined);
                return;
            }
            setGameSession(data[0] as GameSession);
            setInitialBoard(data[0].initialBoard);
            setCurrentBoard(data[0].currentBoard);
            console.log(data[0]);
        },
    });

    const { mutate: updateGameSessionMutate } = useMutation({
        mutationKey: ["update-game-session"],
        mutationFn: updateGameSession,
    });

    const { mutate: deleteGameSessionMutate } = useMutation({
        mutationKey: ["delete-game-session"],
        mutationFn: deleteGameSession,
    });

    const increaseUserTaskProgressMutation = useMutation({
        mutationFn: increaseUserTaskProgress,
        mutationKey: ["increase-user-task-progress-key"],
    });

    const [initialBoard, setInitialBoard] = useState<number[][] | undefined>(
        gameSession?.initialBoard,
    );
    const [solvedBoard, setSolvedBoard] = useState<number[][] | undefined>(
        gameSession?.solvedBoard,
    );
    const [currentBoard, setCurrentBoard] = useState<number[][] | undefined>(
        gameSession?.currentBoard,
    );
    const [selectedCell, setSelectedCell] = useState<number[]>([0, 0]);
    const [numbersLeft, setNumbersLeft] = useState<number[]>(
        new Array(9).fill(9),
    );
    const [lightningMode, setLightningMode] = useState<boolean>(false);
    const [selectedNum, setSelectedNum] = useState<number | undefined>();
    const [lives, setLives] = useState<number>(MAX_LIVES);
    const [score, setScore] = useState<number>(0);
    const [seconds, setSeconds] = useState<number>(0);
    const [isRunning, setIsRunning] = useState<boolean>(true);
    const [lost, setLost] = useState<boolean>(false);
    const [won, setWon] = useState<boolean>(false);
    const intervalRef = useRef<number | null>(null);
    const [selectedRingKey, setSelectedRingKey] = useState(0);
    const [incorrectNum, setIncorrectNum] = useState<number | null>(null);

    const restart = () => {
        setLost(false);
        setIsRunning(true);
        setLives(MAX_LIVES);
        setSeconds(0);
        setScore(0);
        setNumbersLeft(new Array(9).fill(9));
        // createGameSessionMutate({
        //     userId: localStorage.getItem("userId") || "",
        //     difficulty: difficulty,
        // });

        if (won) {
            setWon(false);
        }
    };

    const finish = () => {
        if (!gameSession) return;
        setIsRunning(false);
        setWon(true);
        increaseUserTaskProgressMutation.mutate({
            type: "level_completion",
        });
        deleteGameSessionMutate(gameSession.id);
    };

    const isBoardCompleted = () => {
        if (!currentBoard || !solvedBoard) return false;

        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (currentBoard[row][col] !== solvedBoard[row][col]) {
                    return false;
                }
            }
        }

        return true;
    };

    const decreaseLives = () => {
        setLives(lives => lives - 1);

        if (lives <= 1) {
            setLost(true);
            setIsRunning(false);
            if (gameSession) {
                deleteGameSessionMutate(gameSession.id);
            }
        }
    };

    const calculateScore = (seconds: number) => {
        if (seconds >= 0 && seconds <= 15) {
            return Math.floor(150 * Math.exp(-0.027 * seconds) + 150);
        } else if (seconds > 15 && seconds <= 300) {
            return Math.floor(-0.35 * seconds + 255);
        } else {
            return 150;
        }
    };

    const initialNumbersLeft = (board: number[][] | undefined) => {
        if (!board) return;

        const newNumbersLeft = new Array(9).fill(9);
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const val = board[row][col];
                if (val !== 0) {
                    newNumbersLeft[val - 1] = Math.max(
                        0,
                        newNumbersLeft[val - 1] - 1,
                    );
                }
            }
        }
        setNumbersLeft(newNumbersLeft);
    };

    const onCellClicked = (row: number, col: number) => {
        setSelectedCell([row, col]);
        setSelectedRingKey(prev => prev + 1);

        if (
            lightningMode &&
            initialBoard &&
            currentBoard &&
            solvedBoard &&
            selectedNum &&
            selectedNum !== solvedBoard[row][col] &&
            (currentBoard[row][col] !== initialBoard[row][col] ||
                currentBoard[row][col] === 0)
        ) {
            setIncorrectNum(selectedNum);
        } else {
            setIncorrectNum(null);
            console.log(1);
        }

        if (
            !lightningMode &&
            currentBoard &&
            solvedBoard &&
            currentBoard[row][col] !== solvedBoard[row][col]
        ) {
            setIncorrectNum(currentBoard[row][col]);
        }

        if (
            currentBoard &&
            currentBoard[row][col] !== 0 &&
            isCorrect(row, col)
        ) {
            setSelectedNum(currentBoard[row][col]);
        }

        if (selectedNum && numbersLeft[selectedNum - 1] - 1 === 0) {
            setSelectedNum(undefined);
        }

        if (
            lightningMode &&
            selectedNum &&
            initialBoard &&
            currentBoard &&
            solvedBoard &&
            initialBoard[row][col] === 0 &&
            currentBoard[row][col] !== solvedBoard[row][col] &&
            numbersLeft[selectedNum - 1] !== 0
        ) {
            setCurrentBoard(board =>
                board?.map((r, rowIndex) =>
                    rowIndex === row
                        ? r.map((value, colIndex) =>
                              colIndex === col ? selectedNum : value,
                          )
                        : r,
                ),
            );
        }

        if (
            currentBoard &&
            solvedBoard &&
            lightningMode &&
            selectedNum &&
            !isInInitialGrid(row, col) &&
            solvedBoard[row][col] !== selectedNum &&
            currentBoard[row][col] !== solvedBoard[row][col] &&
            numbersLeft[selectedNum - 1] !== 0 &&
            currentBoard[row][col] === 0
        ) {
            decreaseLives();
        }

        if (
            lightningMode &&
            selectedNum &&
            solvedBoard &&
            currentBoard &&
            solvedBoard[row][col] === selectedNum &&
            currentBoard[row][col] !== selectedNum &&
            !isInInitialGrid(row, col)
        ) {
            setScore(prevScore => prevScore + calculateScore(seconds));
        }

        if (
            currentBoard &&
            lightningMode &&
            solvedBoard &&
            solvedBoard[row][col] !== currentBoard[row][col]
        ) {
            const newNumbersLeft = numbersLeft.map((value, i) =>
                i + 1 === selectedNum &&
                !isInInitialGrid(row, col) &&
                i + 1 === solvedBoard[row][col]
                    ? Math.max(0, value - 1)
                    : value,
            );

            setNumbersLeft(newNumbersLeft);
        }
    };

    const getBlockIndex = useCallback((row: number, col: number) => {
        const blockRow = Math.floor(row / 3);
        const blockCol = Math.floor(col / 3);
        return blockRow * 3 + blockCol;
    }, []);

    const isInSelectedSubgrid = useCallback(
        (row: number, col: number) => {
            return (
                getBlockIndex(row, col) ===
                getBlockIndex(selectedCell[0], selectedCell[1])
            );
        },
        [selectedCell, getBlockIndex],
    );

    const isInInitialGrid = (row: number, col: number) => {
        return (
            currentBoard &&
            initialBoard &&
            currentBoard[row][col] === initialBoard[row][col] &&
            currentBoard[row][col] !== 0
        );
    };

    const findFirstCell = (num: number) => {
        for (let rowIndex = 0; rowIndex < 9; rowIndex++) {
            for (let colIndex = 0; colIndex < 9; colIndex++) {
                if (currentBoard && currentBoard[rowIndex][colIndex] === num) {
                    return [rowIndex, colIndex];
                }
            }
        }
        return [0, 0];
    };

    const onNumberClicked = (num: number) => {
        const [row, col] = selectedCell;

        if (lightningMode) {
            setSelectedNum(num);
            setSelectedCell(findFirstCell(num));
        } else {
            if (
                currentBoard &&
                solvedBoard &&
                (currentBoard[row][col] === solvedBoard[row][col] ||
                    isInInitialGrid(row, col))
            )
                return;

            setCurrentBoard(board =>
                board?.map((r, rowIndex) =>
                    rowIndex === row
                        ? r.map((value, colIndex) =>
                              colIndex === col ? num : value,
                          )
                        : r,
                ),
            );
        }

        if (
            !lightningMode &&
            solvedBoard &&
            currentBoard &&
            solvedBoard[row][col] !== num &&
            currentBoard[row][col] === 0
        ) {
            setIncorrectNum(num); // <-- Add this line

            decreaseLives();
        } else {
            setIncorrectNum(null); // Reset if not incorrect
        }

        if (!lightningMode && solvedBoard) {
            const newNumbersLeft = numbersLeft.map((value, i) =>
                i + 1 === num &&
                !isInInitialGrid(row, col) &&
                i + 1 === solvedBoard[selectedCell[0]][selectedCell[1]]
                    ? Math.max(0, value - 1)
                    : value,
            );

            setNumbersLeft(newNumbersLeft);
        }

        if (!lightningMode && solvedBoard && num === solvedBoard[row][col]) {
            setScore(prevScore => prevScore + calculateScore(seconds));
        }

        setSelectedRingKey(prev => prev + 1);
    };

    const isCorrect = (row: number, col: number) => {
        return (
            currentBoard &&
            ((solvedBoard &&
                currentBoard[row][col] === solvedBoard[row][col]) ||
                currentBoard[row][col] === 0)
        );
    };

    const toggleLightningMode = () => {
        setLightningMode(!lightningMode);

        if (currentBoard) {
            setSelectedNum(
                currentBoard[selectedCell[0]][selectedCell[1]] === 0
                    ? undefined
                    : currentBoard[selectedCell[0]][selectedCell[1]],
            );
        }
    };

    const toggleTimer = () => {
        setIsRunning(!isRunning);
    };

    useEffect(() => {
        getGameSessionMutate(localStorage.getItem("userId") || "");
    }, []);

    useEffect(() => {
        if (gameSession) {
            setInitialBoard(gameSession.initialBoard);
            setCurrentBoard(gameSession.currentBoard);
            setSolvedBoard(gameSession.solvedBoard);
            initialNumbersLeft(gameSession.initialBoard);
            setLives(MAX_LIVES - gameSession.errors);
            setScore(gameSession.score);
            setSeconds(gameSession.time);
            initialNumbersLeft(gameSession.currentBoard);
        }
    }, [gameSession]);

    useEffect(() => {
        if (isBoardCompleted()) {
            finish();
        }
    }, [currentBoard]);

    useEffect(() => {
        if (isRunning) {
            // @ts-ignore
            intervalRef.current = setInterval(() => {
                setSeconds(prev => prev + 1);
            }, 1000);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [isRunning]);

    const saveProgress = () => {
        updateGameSessionMutate({
            userId: localStorage.getItem("userId") || "",
            updates: {
                currentBoard,
                errors: Math.abs(MAX_LIVES - lives),
                score,
                time: seconds,
            },
        });
    };

    return (
        isSuccess && (
            <>
                <div className="flex h-screen min-h-0 flex-col gap-3 p-3">
                    <header className="flex items-center justify-between">
                        <Link to="/" onClick={saveProgress}>
                            <div className="flex size-10 items-center justify-center rounded-full transition active:bg-neutral-200">
                                <span className="material-symbols-outlined ml-2">
                                    arrow_back_ios
                                </span>
                            </div>
                        </Link>
                        <div
                            className="flex h-8 items-center justify-center gap-1 rounded-full border border-neutral-500 px-4 transition active:bg-neutral-200"
                            onClick={toggleTimer}
                        >
                            <span className="leading-0 font-medium text-green-700">
                                {Math.floor(seconds / 60) < 10
                                    ? `0${Math.floor(seconds / 60)}`
                                    : Math.floor(seconds / 60)}
                                :
                                {seconds % 60 < 10
                                    ? `0${seconds % 60}`
                                    : seconds % 60}
                            </span>
                            <span className="material-symbols-outlined fill text-xl! leading-none text-green-700">
                                {isRunning ? "pause" : "play_arrow"}
                            </span>
                        </div>
                        <div className="flex size-10 items-center justify-center rounded-full transition active:bg-neutral-200">
                            <span className="material-symbols-outlined">
                                settings
                            </span>
                        </div>
                    </header>
                    <div className="mt-6 flex items-center justify-between">
                        <span className="font-medium text-neutral-600">
                            {
                                difficulties[
                                    gameSession?.difficulty.name || "easy"
                                ]
                            }
                        </span>
                        <span className="font-medium">Счёт: {score}</span>
                        <div className="flex">
                            {new Array(MAX_LIVES).fill(0).map((_, i) => (
                                <span
                                    key={i}
                                    className={clsx(
                                        "material-symbols-outlined fill text-lg!",
                                        i >= MAX_LIVES - lives
                                            ? "text-red-600"
                                            : "text-neutral-400",
                                    )}
                                >
                                    favorite
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-9 border-2">
                        {currentBoard?.map((row, rowIndex) =>
                            row.map((value, colIndex) => (
                                <div
                                    className="relative"
                                    key={rowIndex + colIndex}
                                >
                                    <motion.div
                                        className={clsx(
                                            "flex aspect-square items-center justify-center text-xl transition-colors",
                                            colIndex !== 8 &&
                                                (colIndex + 1) % 3 === 0
                                                ? "border-r-2 border-r-black"
                                                : "border-r border-r-neutral-400",
                                            rowIndex !== 8 &&
                                                (rowIndex + 1) % 3 === 0
                                                ? "border-b-2 border-b-black"
                                                : "border-b border-b-neutral-400",
                                            (rowIndex === selectedCell[0] ||
                                                colIndex === selectedCell[1] ||
                                                isInSelectedSubgrid(
                                                    rowIndex,
                                                    colIndex,
                                                )) &&
                                                "bg-green-100",
                                            ((selectedCell[0] === rowIndex &&
                                                selectedCell[1] === colIndex) ||
                                                (currentBoard[selectedCell[0]][
                                                    selectedCell[1]
                                                ] === value &&
                                                    value !== 0 &&
                                                    solvedBoard &&
                                                    value ===
                                                        solvedBoard[rowIndex][
                                                            colIndex
                                                        ]) ||
                                                (lightningMode &&
                                                    selectedNum === value &&
                                                    value !== 0 &&
                                                    solvedBoard &&
                                                    value ===
                                                        solvedBoard[rowIndex][
                                                            colIndex
                                                        ])) &&
                                                "bg-green-400",
                                            selectedCell[0] === rowIndex &&
                                                selectedCell[1] === colIndex &&
                                                value !== 0 &&
                                                currentBoard[rowIndex][
                                                    colIndex
                                                ] ===
                                                    currentBoard[
                                                        selectedCell[0]
                                                    ][selectedCell[1]] &&
                                                "bg-green-700 text-white",
                                            solvedBoard &&
                                                selectedCell[0] === rowIndex &&
                                                selectedCell[1] === colIndex &&
                                                value !== 0 &&
                                                currentBoard[rowIndex][
                                                    colIndex
                                                ] !==
                                                    solvedBoard[rowIndex][
                                                        colIndex
                                                    ] &&
                                                "bg-red-700",
                                            lightningMode &&
                                                selectedCell[0] === rowIndex &&
                                                selectedCell[1] === colIndex &&
                                                value === 0 &&
                                                "bg-green-100!",
                                            solvedBoard &&
                                                currentBoard[rowIndex][
                                                    colIndex
                                                ] !==
                                                    solvedBoard[rowIndex][
                                                        colIndex
                                                    ] &&
                                                "text-red-700",
                                            initialBoard &&
                                                initialBoard[rowIndex][
                                                    colIndex
                                                ] ===
                                                    currentBoard[rowIndex][
                                                        colIndex
                                                    ]
                                                ? "text-black"
                                                : "text-green-700",
                                            incorrectNum &&
                                                value === incorrectNum &&
                                                "bg-red-400",
                                        )}
                                        onClick={() =>
                                            onCellClicked(rowIndex, colIndex)
                                        }
                                    >
                                        {value !== 0 && value}
                                    </motion.div>
                                    {((selectedCell[0] === rowIndex &&
                                        selectedCell[1] === colIndex &&
                                        value !== 0) ||
                                        (currentBoard[selectedCell[0]][
                                            selectedCell[1]
                                        ] === value &&
                                            value !== 0 &&
                                            solvedBoard &&
                                            initialBoard &&
                                            (value ===
                                                solvedBoard[rowIndex][
                                                    rowIndex
                                                ] ||
                                                value ===
                                                    initialBoard[rowIndex][
                                                        colIndex
                                                    ])) ||
                                        (lightningMode &&
                                            selectedNum === value &&
                                            value !== 0 &&
                                            selectedNum === incorrectNum)) && (
                                        <motion.div
                                            key={
                                                selectedRingKey +
                                                "-" +
                                                rowIndex +
                                                "-" +
                                                colIndex
                                            }
                                            className="absolute inset-2 top-0 left-0 z-10 h-full w-full ring-6 ring-red-500"
                                            animate={{
                                                opacity: [1, 1, 0],
                                            }}
                                            transition={{
                                                duration: 0.5,
                                                ease: "linear",
                                            }}
                                        />
                                    )}
                                </div>
                            )),
                        )}
                    </div>
                    <div
                        className="flex justify-end"
                        onClick={toggleLightningMode}
                    >
                        <div
                            className={clsx(
                                "flex h-5 w-9 items-center rounded-full px-0.5",
                                lightningMode
                                    ? "justify-end bg-green-600"
                                    : "justify-start bg-neutral-400",
                            )}
                        >
                            <motion.div
                                layout
                                transition={{
                                    type: "spring",
                                    visualDuration: 0.2,
                                    bounce: 0.2,
                                }}
                                className="flex size-4 items-center justify-center rounded-full bg-white"
                            >
                                <span
                                    className={clsx(
                                        "material-symbols-outlined fill text-[13px]!",
                                        lightningMode
                                            ? "text-green-600"
                                            : "text-neutral-400",
                                    )}
                                >
                                    bolt
                                </span>
                            </motion.div>
                        </div>
                    </div>
                    <div className="min-h-0 flex-1 py-4">
                        <img
                            src="/images/armin.png"
                            className="h-full w-full object-contain transition active:scale-[0.98]"
                        />
                    </div>
                    <div className="grid grid-cols-9">
                        {numbersLeft.map((value, i) =>
                            numbersLeft[i] !== 0 ? (
                                <button
                                    key={i}
                                    className={clsx(
                                        "flex h-20 w-full flex-col items-center justify-center gap-1 transition",
                                        !lightningMode &&
                                            "active:bg-neutral-200",
                                        lightningMode &&
                                            (i + 1 === selectedNum
                                                ? "opacity-100"
                                                : "opacity-50"),
                                        lightningMode &&
                                            selectedNum === i + 1 &&
                                            "bg-green-100",
                                    )}
                                    onClick={() => onNumberClicked(i + 1)}
                                >
                                    <span className="text-3xl font-medium text-green-700">
                                        {i + 1}
                                    </span>
                                    <span>{value}</span>
                                </button>
                            ) : (
                                <div key={i} className="h-20 w-full" />
                            ),
                        )}
                    </div>
                </div>
                <Modal open={!isRunning && !lost}>
                    <div className="flex flex-col items-center gap-6 p-4">
                        <h1 className="text-2xl font-bold">Пауза</h1>
                        <p className="text-center text-neutral-600">
                            Игра приостановлена
                        </p>
                        <div className="flex w-full flex-col gap-1">
                            <button
                                className="h-10 w-full rounded-full bg-green-600 font-medium text-white transition active:bg-green-700"
                                onClick={toggleTimer}
                            >
                                Продолжить
                            </button>
                            <button
                                className="h-10 w-full rounded-full border border-neutral-400 bg-neutral-200 font-medium transition"
                                onClick={() => {
                                    navigate("/");
                                    saveProgress();
                                }}
                            >
                                Выйти
                            </button>
                        </div>
                    </div>
                </Modal>
                <Modal open={lost}>
                    <div className="flex flex-col items-center gap-6 p-4">
                        <h1 className="text-2xl font-bold">Игра окончена</h1>
                        <p className="text-center text-neutral-600">
                            Игра окончена
                        </p>
                        <div className="flex w-full flex-col gap-1">
                            <button
                                className="h-10 w-full rounded-full bg-green-600 font-medium text-white transition active:scale-95 active:bg-green-700"
                                onClick={restart}
                            >
                                Начать заново
                            </button>
                            <button
                                className="h-10 w-full rounded-full border border-neutral-400 bg-neutral-200 font-medium transition active:scale-95"
                                onClick={() => navigate("/")}
                            >
                                Выйти
                            </button>
                        </div>
                    </div>
                </Modal>
                <Modal open={won && !isRunning}>
                    <div className="flex flex-col items-center gap-6 p-4">
                        <h1 className="text-2xl font-bold">Победа</h1>
                        <p className="text-center text-neutral-600">
                            Вы успешно завершили игру!
                        </p>
                        <div className="flex w-full flex-col gap-1">
                            <button
                                className="h-10 w-full rounded-full bg-green-600 font-medium text-white transition active:bg-green-700"
                                onClick={restart}
                            >
                                Начать заново
                            </button>
                            <button
                                className="h-10 w-full rounded-full border border-neutral-400 bg-neutral-200 font-medium transition"
                                onClick={() => navigate("/")}
                            >
                                Выйти
                            </button>
                        </div>
                    </div>
                </Modal>
            </>
        )
    );
};
