"use client";

import { useAdmin } from "@/contexts/admin-context";
import { Loader2 } from "lucide-react";

export default function Page() {
  const { admin, isLoading, error } = useAdmin();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-brand-orange" />
        <span className="ml-2 text-gray-400">Carregando informações...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-900/20 border border-red-800 rounded-md text-red-300">
        <h2 className="text-xl font-semibold mb-2">Erro ao carregar dados</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Painel Administrativo</h1>

      {admin && (
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            Bem-vindo, {admin.name}!
          </h2>
          <div className="space-y-2 text-gray-300">
            <p>
              <span className="font-medium text-white">Email:</span>{" "}
              {admin.email}
            </p>
            <p>
              <span className="font-medium text-white">ID:</span> {admin.id}
            </p>
            <p>
              <span className="font-medium text-white">Conta criada em:</span>{" "}
              {new Date(admin.createdAt).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
