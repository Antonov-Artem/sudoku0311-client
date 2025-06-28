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
    const [show, setShow] = useState(true);

    useEffect(() => {
        const timer1 = setTimeout(() => {
            confetti({
                particleCount: 150,
                spread: 70,
                origin: {
                    y: 0.6,
                },
            });
        }, 500);

        const timer2 = setTimeout(() => {
            setShow(false);
        }, 3000);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, []);

    return (
        <>
            <AnimatePresence>
                {show && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="fixed top-0 left-0 z-50 flex h-screen w-screen flex-col items-center justify-center gap-10 bg-green-600"
                    >
                        <p className="w-1/2 text-center text-4xl leading-14 font-bold text-white">
                            С Днем Рождения!
                        </p>
                        <img
                            src="https://sdmntprpolandcentral.oaiusercontent.com/files/00000000-96f0-620a-a6e3-823cfe78e140/raw?se=2025-06-28T09%3A40%3A24Z&sp=r&sv=2024-08-04&sr=b&scid=4ebd968a-7034-58da-9724-ca1543fed38e&skoid=76024c37-11e2-4c92-aa07-7e519fbe2d0f&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-06-28T06%3A35%3A53Z&ske=2025-06-29T06%3A35%3A53Z&sks=b&skv=2024-08-04&sig=5wx/34RGnZ9Z9F%2BTAKYPhJ1wuYEIKcSgmZjLSEfRbq8%3D"
                            className="w-2/3 rounded-xl"
                        />
                    </motion.div>
                )}
            </AnimatePresence>
            {!show && (
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
                                <NavLink
                                    to="/register"
                                    className="pl-2 text-blue-600"
                                >
                                    Зарегестрироваться
                                </NavLink>
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
