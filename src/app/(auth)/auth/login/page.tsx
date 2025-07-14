"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ArrowLeft, AlertCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Credits } from "@/components/credits";
import { useRouter } from "next/navigation";

const loginFormSchema = z.object({
  email: z.string().email({ message: "Por favor, insira um email válido" }),
  password: z
    .string()
    .min(8, { message: "Senha deve ter pelo menos 8 caracteres" })
    .regex(/[A-Z]/, {
      message: "Senha deve conter pelo menos uma letra maiúscula",
    })
    .regex(/[a-z]/, {
      message: "Senha deve conter pelo menos uma letra minúscula",
    })
    .regex(/[0-9]/, { message: "Senha deve conter pelo menos um número" }),
});

type LoginFormData = z.infer<typeof loginFormSchema>;

export default function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
        // Include credentials to ensure cookies are sent with the request
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Falha ao realizar login");
      }

      router.push("/admin/");
    } catch (error) {
      console.error("Erro de login:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Ocorreu um erro ao tentar fazer login"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen bg-gray-900">
      <Link
        href="/"
        className="fixed top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-md border border-gray-700 hover:bg-gray-700 transition-colors duration-200"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Voltar ao site</span>
      </Link>

      {/* Left side content remains unchanged */}
      <div className="hidden md:flex md:w-2/3 bg-gray-800 flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80"></div>

        <div className="relative z-10 flex flex-col items-center justify-center space-y-8 px-8">
          <div className="bg-white p-4 rounded-lg shadow-2xl transform hover:scale-105 transition-transform duration-300">
            <Image
              src="/brand/mt9-logo.svg"
              width={300}
              height={100}
              alt="Logo MT 9"
              className="w-64"
            />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-white text-center">
            Painel Administrativo
            <span className="block text-brand-orange mt-2">MT 9</span>
          </h1>

          <p className="text-gray-300 text-center max-w-xl text-md">
            Gerencie conteúdos, eventos e informações da plataforma Guia Terra
            Nova do Norte
          </p>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-orange to-transparent"></div>
      </div>

      <div className="w-full md:w-1/3 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6 rounded-lg bg-gray-800 p-8 shadow-lg border border-gray-700">
          <div className="text-center">
            <div className="md:hidden flex justify-center mb-6">
              <Image
                src="./brand/mt9-logo.svg"
                width={180}
                height={56}
                alt="Logo MT 9"
                className="w-48 bg-white px-3 py-1 rounded-sm"
              />
            </div>
            <h2 className="text-2xl font-bold text-white">Acesso Restrito</h2>
            <p className="mt-2 text-sm text-gray-400">
              Digite suas credenciais para acessar o painel
            </p>
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-800 text-red-300 px-4 py-3 rounded-md flex items-start gap-2">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {isLoading ? (
            <div className="space-y-4">
              <div className="h-10 w-full animate-pulse rounded bg-gray-700"></div>
              <div className="h-10 w-full animate-pulse rounded bg-gray-700"></div>
              <div className="h-10 w-3/4 animate-pulse rounded bg-gray-700 mx-auto"></div>
            </div>
          ) : (
            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    {...register("email")}
                    className="relative block w-full appearance-none rounded-md border border-gray-700 bg-gray-700 px-3 py-2 text-white placeholder-gray-500 focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange sm:text-sm transition-colors"
                    placeholder="seu.email@exemplo.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-400">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Senha
                  </label>
                  <input
                    id="password"
                    type="password"
                    {...register("password")}
                    className="relative block w-full appearance-none rounded-md border border-gray-700 bg-gray-700 px-3 py-2 text-white placeholder-gray-500 focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange sm:text-sm transition-colors"
                    placeholder="Sua senha"
                  />
                  {errors.password && (
                    <p className="mt-1 text-xs text-red-400">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative flex w-full justify-center rounded-md border border-transparent bg-brand-orange px-4 py-2.5 text-sm font-medium text-white hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-70 transition-all duration-200 shadow-lg hover:shadow-brand-orange/30"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    "Entrar"
                  )}
                </button>
              </div>
            </form>
          )}

          <div className="mt-8 pt-4 border-t border-gray-700">
            <Credits variant="dark" />
          </div>
        </div>
      </div>
    </main>
  );
}