import type {
    SolvedSudokuPuzzle,
    SudokuBoard,
    SudokuDifficulty,
} from "../model/types.ts";

export const getSudoku = async (
    difficulty: SudokuDifficulty,
): Promise<SudokuBoard> => {
    const res = await fetch(
        `https://sugoku.onrender.com/board?difficulty=${difficulty}`,
    );
    return (await res.json()) as Promise<SudokuBoard>;
};

function encodeBoard(board?: number[][]) {
    return board?.map(row => `%5B${row.join("%2C")}%5D`).join("%2C");
}

function encodeParams(params: { [x: string]: number[][]; board?: any }) {
    return Object.keys(params)
        .map(key => `${key}=%5B${encodeBoard(params[key])}%5D`)
        .join("&");
}

export const solveSudoku = async (
    board?: number[][],
): Promise<SolvedSudokuPuzzle | undefined> => {
    if (!board) return;

    const response = await fetch("https://sugoku.onrender.com/solve", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: encodeParams({ board }),
    });

    if (!response.ok) {
        throw new Error("Failed to solve Sudoku puzzle");
    }

    return response.json();
};
