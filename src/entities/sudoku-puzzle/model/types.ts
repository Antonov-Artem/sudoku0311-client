export type SudokuDifficulty = "easy" | "medium" | "hard";

export type SudokuPuzzle = number[][];

export type SudokuBoard = {
    board: SudokuPuzzle;
};

export type SolvedSudokuPuzzle = {
    difficulty: SudokuDifficulty;
    solution: SudokuPuzzle;
};
