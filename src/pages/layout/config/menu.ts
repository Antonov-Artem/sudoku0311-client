import { nanoid } from "nanoid";
import type { MenuItem } from "widgets/bottom-bar";

export const menu: MenuItem[] = [
    { key: nanoid(), icon: "home", path: "/" },
    { key: nanoid(), icon: "assignment", path: "/tasks" },
    { key: nanoid(), icon: "play_arrow", path: "/game" },
    { key: nanoid(), icon: "ifl", path: "/casino" },
    { key: nanoid(), icon: "travel_luggage_and_bags", path: "/inventory" },
];
