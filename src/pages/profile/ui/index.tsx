import { useMutation, useQuery } from "@tanstack/react-query";
import { getProfile } from "entities/profile";
import { logout } from "entities/user";
import { Link, useNavigate } from "react-router";

export const ProfilePage = () => {
    const navigate = useNavigate();
    const { data: profile } = useQuery({
        queryKey: ["profile-key"],
        queryFn: getProfile,
    });
    const logoutMutation = useMutation({
        mutationFn: logout,
        onSuccess: () => {
            navigate("/login");
        },
    });

    return (
        <div className="bg-linear-to-b from-indigo-900 to-black">
            <div className="h-[30vh] p-4">
                <div className="flex items-center justify-between">
                    <Link to="/">
                        <button className="flex size-10 items-center justify-center rounded-full border-neutral-400 bg-white transition active:bg-neutral-200">
                            <span className="material-symbols-outlined ml-2 text-xl!">
                                arrow_back_ios
                            </span>
                        </button>
                    </Link>
                    <div className="flex gap-2">
                        <button
                            className="flex size-10 items-center justify-center rounded-full border-red-400 bg-red-200 transition active:bg-red-300"
                            onClick={() => {
                                logoutMutation.mutate();
                            }}
                        >
                            <span className="material-symbols-outlined text-xl! text-red-800">
                                logout
                            </span>
                        </button>
                        <Link to="/settings">
                            <button className="flex size-10 items-center justify-center rounded-full border-neutral-400 bg-white transition active:bg-neutral-200">
                                <span className="material-symbols-outlined text-xl!">
                                    settings
                                </span>
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
            <div className="absolute left-1/2 -translate-1/2">
                <div className="relative size-40 rounded-full border-4 border-white bg-indigo-700">
                    <div className="absolute -bottom-2 left-1/2 flex h-6 -translate-x-1/2 items-center rounded-full bg-neutral-300 px-3 font-medium">
                        LVL {profile?.level}
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-10 rounded-t-2xl bg-white px-4 pt-24 pb-4">
                <div className="flex flex-col items-center gap-10">
                    <div className="flex flex-col items-center gap-1">
                        <h2 className="text-3xl font-bold">
                            {profile?.userName}
                        </h2>
                        <p className="text-base text-neutral-600">
                            @{profile?.userId}
                        </p>
                    </div>
                    {/* <div className="flex gap-8">
                        <div className="flex flex-col items-center gap-1">
                            <p className="text-xl font-bold">1</p>
                            <p className="text-neutral-600">Подисчиков</p>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <p className="text-xl font-bold">1</p>
                            <p className="text-neutral-600">Подписок</p>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <p className="text-xl font-bold">1,500</p>
                            <p className="text-neutral-600">pts</p>
                        </div>
                    </div> */}
                </div>
                <div className="flex flex-col gap-4">
                    <h2 className="text-xl font-bold">Коллекция</h2>
                    <div className="grid h-[20vh] grid-cols-3 gap-2">
                        <div className="rounded-lg bg-neutral-400" />
                        <div className="rounded-lg bg-neutral-400" />
                        <div className="rounded-lg bg-neutral-400" />
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                    <h2 className="text-xl font-bold">Награды</h2>
                    <div className="grid grid-cols-3 gap-2">
                        <div className="aspect-square rounded-lg bg-neutral-400" />
                        <div className="aspect-square rounded-lg bg-neutral-400" />
                        <div className="aspect-square rounded-lg bg-neutral-400" />
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                    <h2 className="text-xl font-bold">Достижения</h2>
                    <div className="grid grid-cols-3 gap-2">
                        <div className="aspect-square rounded-lg bg-neutral-400" />
                        <div className="aspect-square rounded-lg bg-neutral-400" />
                        <div className="aspect-square rounded-lg bg-neutral-400" />
                    </div>
                </div>
            </div>
        </div>
    );
};
