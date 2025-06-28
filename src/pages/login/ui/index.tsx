import { useMutation } from "@tanstack/react-query";
import confetti from "canvas-confetti";
import { login } from "entities/user";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router";

export const LoginPage = () => {
    const navigate = useNavigate();
    const loginMutation = useMutation({
        mutationFn: ({
            email,
            password,
        }: {
            email: string;
            password: string;
        }) => login(email, password),
        onSuccess: () => {
            navigate("/");
        },
    });
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <div className="flex h-screen items-center justify-center">
            <div className="flex w-2xs flex-col items-center gap-8">
                <h1 className="text-3xl font-bold">Вход</h1>
                <div className="flex w-full flex-col gap-6">
                    <div className="flex w-full flex-col gap-2">
                        <input
                            type="text"
                            placeholder="E-mail"
                            className="h-10 rounded-lg border border-neutral-400 px-3 outline-green-600"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Пароль"
                            className="h-10 rounded-lg border border-neutral-400 px-3 outline-green-600"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                        <button
                            className="h-10 w-full rounded-lg bg-green-600 font-medium text-white transition active:bg-green-700"
                            onClick={() =>
                                loginMutation.mutate({
                                    email,
                                    password,
                                })
                            }
                        >
                            Войти
                        </button>
                    </div>
                    <p>
                        Нет аккаунта?
                        <NavLink to="/register" className="pl-2 text-blue-600">
                            Зарегестрироваться
                        </NavLink>
                    </p>
                </div>
            </div>
        </div>
    );
};
