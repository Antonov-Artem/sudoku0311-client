import type { ButtonProps } from "./types.ts";

export const Button = ({
    onClick,
    timeout,
    children,
    ...props
}: ButtonProps) => {
    // @ts-ignore
    const onButtonClicked = e => {
        if (!onClick) return;

        if (!timeout) {
            onClick(e);
            return;
        }

        setTimeout(() => {
            onClick(e);
        }, timeout);
    };

    return (
        <button onClick={e => onButtonClicked(e)} {...props}>
            {children}
        </button>
    );
};
