"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// TODO: deixar um pouco mais bonita
// linkar com api de login correta, relacionar com erros de auth

// Validação utilizando zod dos campos email e senha
const validacao = z.object({
    email: z.string().email({ message: "Insira um e-mail válido" }),
    senha: z.string().min(6, { message: "Insira uma senha válida" }),
});

// Tipos para o formulário conforme definido em validacao
type formData = z.infer<typeof validacao>;

export default function Login() {
    // Controle dos estados de senha e mensagem de erro
    const [viewSenha, setViewSenha] = useState(false);
    const [mensagemErro, setMensagemErro] = useState("");
    const router = useRouter();

    // Gerenciamento do formulário
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<formData>({
        resolver: zodResolver(validacao),
    });

    return (
        <div className="flex flex-col flex-grow text-black">
            <div className="flex flex-grow-0 mx-auto mt-10 w-fit">
                <Image width={350} height={350} alt="Logo Sistema" src="/Logo.png" />
            </div>
            <div className="flex relative flex-col p-2 px-10 m-auto h-1/2 bg-white rounded-xl shadow-xl w-[21%] min-w-[20rem]">
                {mensagemErro && (
                    <div className="flex absolute inset-x-0 top-0 justify-center items-center p-2 text-lg text-center whitespace-pre-line bg-red-400 rounded-xl">
                        {mensagemErro}
                    </div>
                )}
                <h1 className="py-10 text-5xl font-bold text-center">Bem-vindo</h1>
                {/* Lógica de submissão do formulário */}
                <form
                    className="flex flex-col flex-grow gap-8"
                    onSubmit={handleSubmit(async (data) => {
                        const login = await signIn("credentials", {
                            username: data.email,
                            password: data.senha,
                            redirect: false,
                        });
                        console.log(login);
                        if (login?.error) {
                            setMensagemErro(login.error);
                        } else {
                            const url = new URL(login?.url!);
                            if (url.searchParams.get("callbackUrl")) {
                                router.push(url.searchParams.get("callbackUrl")!);
                            } else router.push("/");
                        }
                    })}
                >
                    <span className="flex relative">
                        <span className="flex flex-col flex-grow">
                            <label className="text-xl">Usuário:</label>
                            <input
                                type="text"
                                className={cn(
                                    "border-2 placeholder:font-bold placeholder:opacity-100 px-2 bg-[#d1dbe8] rounded-full p-1 placeholder:text-center flex-grow border-transparent",
                                    { "border-red-400": errors.email?.message },
                                )}
                                {...register("email")}
                            />
                        </span>
                        {errors.email && (
                            <p className="absolute right-0 left-0 -bottom-7 text-lg text-center text-red-400">
                                {errors.email?.message}
                            </p>
                        )}
                    </span>
                    <span className="flex relative">
                        <span className="flex flex-col flex-grow">
                            <label className="text-xl">Senha:</label>
                            <span className="flex relative flex-grow">
                                <input
                                    type={viewSenha ? "text" : "password"}
                                    className={cn(
                                        "border-2 placeholder:font-bold placeholder:opacity-100 px-2 bg-[#d1dbe8] rounded-full p-1 placeholder:text-center flex-grow border-transparent",
                                        { "border-red-400": errors.senha?.message },
                                    )}
                                    {...register("senha")}
                                />

                                <span
                                    onClick={() => setViewSenha(!viewSenha)}
                                    className="flex absolute top-0 bottom-0 right-2 items-center"
                                >
                                    {viewSenha ? (
                                        <EyeOff className="stroke-black" size={30} />
                                    ) : (
                                        <Eye className="stroke-black" size={30} />
                                    )}
                                </span>
                            </span>
                        </span>
                        {errors.senha && (
                            <p className="absolute right-0 left-0 -bottom-7 text-lg text-center text-red-400">
                                {errors.senha?.message}
                            </p>
                        )}
                    </span>
                    <button className="py-2 px-5 mt-4 text-xl font-bold text-white uppercase bg-gradient-to-tr from-blue-500 rounded-lg to-[#493960]">
                        Entrar
                    </button>
                </form>
            </div>
        </div>
    );
}
