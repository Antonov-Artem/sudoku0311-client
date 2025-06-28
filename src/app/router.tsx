import { lazy } from "react";
import { createBrowserRouter } from "react-router";

const CasinoPage = lazy(() =>
    import("pages/casino").then(module => ({ default: module.CasinoPage })),
);

const GamePage = lazy(() =>
    import("pages/game").then(module => ({ default: module.GamePage })),
);

const HomePage = lazy(() =>
    import("pages/home").then(module => ({ default: module.HomePage })),
);

const InventoryPage = lazy(() =>
    import("pages/inventory").then(module => ({
        default: module.InventoryPage,
    })),
);

const Layout = lazy(() =>
    import("pages/layout").then(module => ({ default: module.Layout })),
);

const LoginPage = lazy(() =>
    import("pages/login").then(module => ({ default: module.LoginPage })),
);

const ProfilePage = lazy(() =>
    import("pages/profile").then(module => ({ default: module.ProfilePage })),
);

const RegisterPage = lazy(() =>
    import("pages/register").then(module => ({ default: module.RegisterPage })),
);

const SettingsPage = lazy(() =>
    import("pages/settings").then(module => ({ default: module.SettingsPage })),
);

const ShopPage = lazy(() =>
    import("pages/shop").then(module => ({ default: module.ShopPage })),
);

const TasksPage = lazy(() =>
    import("pages/tasks").then(module => ({ default: module.TasksPage })),
);

export const router = createBrowserRouter([
    { path: "/game", element: <GamePage /> },
    {
        element: <Layout />,
        children: [
            { path: "/login", element: <LoginPage /> },
            { path: "/register", element: <RegisterPage /> },
            { path: "/profile", element: <ProfilePage /> },
            { path: "/settings", element: <SettingsPage /> },
            { path: "/shop", element: <ShopPage /> },
        ],
    },
    {
        element: <Layout bottomBar />,
        children: [
            { path: "/", element: <HomePage /> },
            { path: "/tasks", element: <TasksPage /> },
            { path: "/casino", element: <CasinoPage /> },
            { path: "/inventory", element: <InventoryPage /> },
        ],
    },
]);
