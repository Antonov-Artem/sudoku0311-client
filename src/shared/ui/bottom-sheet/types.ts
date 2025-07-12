import type { Dispatch, ReactNode, SetStateAction } from "react";

export type BottomSheetProps = {
    open: boolean;
    children?: ReactNode;
    setOpen: Dispatch<SetStateAction<boolean>>;
};
