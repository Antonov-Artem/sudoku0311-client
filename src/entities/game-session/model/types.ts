export type SudokuDifficulty = "easy" | "medium" | "hard";

export type GameSession = {
    id: string;
    difficulty: { name: SudokuDifficulty };
    currentBoard: number[][];
    initialBoard: number[][];
    solvedBoard: number[][];
    score: number;
    time: number;
    errors: number;
};
