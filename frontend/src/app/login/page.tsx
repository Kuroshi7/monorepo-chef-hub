"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter ao menos 6 caracteres"),
});

const registerSchema = z.object({
  name: z.string().min(2, "Nome obrigatório"),
  email: z.email("Email inválido"),
  password: z.string().min(6, "Senha deve ter ao menos 6 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"login" | "register">("login");

  // login
  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors, isSubmitting: isLoginSubmitting },
    reset: resetLogin,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // cadastro
  const {
    register: registerRegister,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors, isSubmitting: isRegisterSubmitting },
    reset: resetRegister,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onLogin: SubmitHandler<LoginFormData> = async (data) => {
    setError("");
    try {
      const res = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Credenciais inválidas");
      const { token } = await res.json();
      localStorage.setItem("jwt", token);
      router.push("/dashboard");
      resetLogin();
    } catch (err: any) {
      setError(err.message || "Erro ao logar");
    }
  };

  const onRegister: SubmitHandler<RegisterFormData> = async (data) => {
    setError("");
    try {
      const res = await fetch("http://localhost:3001/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Erro ao cadastrar");
      const { token } = await res.json();
      localStorage.setItem("jwt", token);
      router.push("/dashboard");
      resetRegister();
    } catch (err: any) {
      setError(err.message || "Erro ao cadastrar");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-200 via-white to-blue-300">
      <div className="bg-gray-50 p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6 border border-gray-200">
        <div className="flex justify-center mb-4">
          <button
            className={`px-6 py-2 rounded-t-lg font-semibold transition-colors duration-200 border-b-2 ${
              mode === "login"
                ? "bg-blue-700 text-white border-blue-700 shadow"
                : "bg-gray-200 text-gray-700 border-transparent"
            }`}
            onClick={() => {
              setMode("login");
              setError("");
            }}
            type="button"
          >
            Entrar
          </button>
          <button
            className={`px-6 py-2 rounded-t-lg font-semibold transition-colors duration-200 border-b-2 ${
              mode === "register"
                ? "bg-blue-700 text-white border-blue-700 shadow"
                : "bg-gray-200 text-gray-700 border-transparent"
            }`}
            onClick={() => {
              setMode("register");
              setError("");
            }}
            type="button"
          >
            Cadastrar
          </button>
        </div>
        {mode === "login" ? (
          <form onSubmit={handleLoginSubmit(onLogin)} className="space-y-5">
            <h1 className="text-2xl font-bold text-center mb-2 text-blue-900">Bem-vindo!</h1>
            <div>
              <Input
                type="email"
                placeholder="Email"
                {...loginRegister("email")}
                disabled={isLoginSubmitting}
                className="w-full border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 text-gray-900 bg-white"
              />
              {loginErrors.email && (
                <span className="text-red-600 text-sm">{loginErrors.email.message}</span>
              )}
            </div>
            <div>
              <Input
                type="password"
                placeholder="Senha"
                {...loginRegister("password")}
                disabled={isLoginSubmitting}
                className="w-full border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 text-gray-900 bg-white"
              />
              {loginErrors.password && (
                <span className="text-red-600 text-sm">{loginErrors.password.message}</span>
              )}
            </div>
            {error && <div className="text-red-600 text-sm text-center">{error}</div>}
            <Button
              type="submit"
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg py-2 shadow transition"
              disabled={isLoginSubmitting}
            >
              {isLoginSubmitting ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit(onRegister)} className="space-y-5">
            <h1 className="text-2xl font-bold text-center mb-2 text-blue-900">Crie sua conta</h1>
            <div>
              <Input
                type="text"
                placeholder="Nome"
                {...registerRegister("name")}
                disabled={isRegisterSubmitting}
                className="w-full border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 text-gray-900 bg-white"
              />
              {registerErrors.name && (
                <span className="text-red-600 text-sm">{registerErrors.name.message}</span>
              )}
            </div>
            <div>
              <Input
                type="email"
                placeholder="Email"
                {...registerRegister("email")}
                disabled={isRegisterSubmitting}
                className="w-full border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 text-gray-900 bg-white"
              />
              {registerErrors.email && (
                <span className="text-red-600 text-sm">{registerErrors.email.message}</span>
              )}
            </div>
            <div>
              <Input
                type="password"
                placeholder="Senha"
                {...registerRegister("password")}
                disabled={isRegisterSubmitting}
                className="w-full border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 text-gray-900 bg-white"
              />
              {registerErrors.password && (
                <span className="text-red-600 text-sm">{registerErrors.password.message}</span>
              )}
            </div>
            {error && <div className="text-red-600 text-sm text-center">{error}</div>}
            <Button
              type="submit"
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg py-2 shadow transition"
              disabled={isRegisterSubmitting}
            >
              {isRegisterSubmitting ? "Cadastrando..." : "Cadastrar"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
