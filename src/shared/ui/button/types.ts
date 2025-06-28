import type { ButtonHTMLAttributes } from "react";

export type ButtonProps = {
    timeout?: number;
} & ButtonHTMLAttributes<HTMLButtonElement>;
