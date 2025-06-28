import { register } from "entities/user";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router";

export const RegisterPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    const handleRegister = async (
        email: string,
        password: string,
        name: string,
    ) => {
        try {
            await register(email, password, name);
            navigate("/login");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex h-screen items-center justify-center">
            <div className="flex w-2xs flex-col items-center gap-8">
                <h1 className="text-3xl font-bold">Регетсрация</h1>
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
                        <input
                            type="text"
                            placeholder="Имя"
                            className="h-10 rounded-lg border border-neutral-400 px-3 outline-green-600"
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                        <button
                            className="h-10 rounded-lg bg-green-600 font-medium text-white transition active:bg-green-700"
                            onClick={handleRegister.bind(
                                null,
                                email,
                                password,
                                name,
                            )}
                        >
                            Зарегестрироваться
                        </button>
                    </div>
                    <p>
                        Есть аккаунт?
                        <NavLink to="/login" className="pl-2 text-blue-600">
                            Войти
                        </NavLink>
                    </p>
                </div>
            </div>
        </div>
    );
};
