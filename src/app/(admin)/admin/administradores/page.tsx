"use client";

import { useEffect, useState } from "react";
import { useAdmin } from "@/contexts/admin-context";
import { Loader2, Plus, Pencil, Trash2, AlertCircle, Check, X } from "lucide-react";
import { z } from "zod";

type Admin = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  createdBy: string;
};

const adminFormSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(8, { message: "Senha deve ter pelo menos 8 caracteres" })
    .regex(/[A-Z]/, { message: "Senha deve conter pelo menos uma letra maiúscula" })
    .regex(/[0-9]/, { message: "Senha deve conter pelo menos um número" }),
});

const adminUpdateSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }).optional(),
  email: z.string().email({ message: "Email inválido" }).optional(),
  password: z.string().min(8, { message: "Senha deve ter pelo menos 8 caracteres" })
    .regex(/[A-Z]/, { message: "Senha deve conter pelo menos uma letra maiúscula" })
    .regex(/[0-9]/, { message: "Senha deve conter pelo menos um número" })
    .optional(),
});

export default function AdminPage() {
  const { admin, isLoading: isContextLoading } = useAdmin();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    if (admin) {
      fetchAdmins();
    }
  }, [admin]);

  const fetchAdmins = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(
        `/api/auth/admin?adminSecret=${process.env.NEXT_PUBLIC_ADMIN_SECRET_KEY}`
      );

      if (!response.ok) {
        throw new Error("Falha ao carregar administradores");
      }

      const data = await response.json();
      setAdmins(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (isUpdate = false) => {
    try {
      if (isUpdate) {
        adminUpdateSchema.parse(formData);
      } else {
        adminFormSchema.parse(formData);
      }
      setFormErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        err.errors.forEach((error) => {
          const field = error.path[0] as string;
          errors[field] = error.message;
        });
        setFormErrors(errors);
      }
      return false;
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await fetch("/api/auth/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          adminSecret: process.env.NEXT_PUBLIC_ADMIN_SECRET_KEY,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Falha ao adicionar administrador");
      }

      setNotification({
        type: "success",
        message: "Administrador adicionado com sucesso!",
      });
      setIsAddModalOpen(false);
      setFormData({ name: "", email: "", password: "" });
      fetchAdmins();
    } catch (err) {
      setNotification({
        type: "error",
        message: err instanceof Error ? err.message : "Erro desconhecido",
      });
    }
  };

  const handleEditAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm(true) || !selectedAdmin) return;

    // Remover campos vazios
    const updateData = Object.entries(formData).reduce(
      (acc, [key, value]) => {
        if (value) acc[key as keyof typeof formData] = value;
        return acc;
      },
      {} as typeof formData
    );

    try {
      const response = await fetch("/api/auth/admin", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...updateData,
          id: selectedAdmin.id,
          adminSecret: process.env.NEXT_PUBLIC_ADMIN_SECRET_KEY,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Falha ao atualizar administrador");
      }

      setNotification({
        type: "success",
        message: "Administrador atualizado com sucesso!",
      });
      setIsEditModalOpen(false);
      setFormData({ name: "", email: "", password: "" });
      setSelectedAdmin(null);
      fetchAdmins();
    } catch (err) {
      setNotification({
        type: "error",
        message: err instanceof Error ? err.message : "Erro desconhecido",
      });
    }
  };

  const handleDeleteAdmin = async () => {
    if (!selectedAdmin) return;

    try {
      const response = await fetch(
        `/api/auth/admin?adminSecret=${process.env.NEXT_PUBLIC_ADMIN_SECRET_KEY}&id=${selectedAdmin.id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Falha ao excluir administrador");
      }

      setNotification({
        type: "success",
        message: "Administrador excluído com sucesso!",
      });
      setIsDeleteModalOpen(false);
      setSelectedAdmin(null);
      fetchAdmins();
    } catch (err) {
      setNotification({
        type: "error",
        message: err instanceof Error ? err.message : "Erro desconhecido",
      });
    }
  };

  const openEditModal = (admin: Admin) => {
    setSelectedAdmin(admin);
    setFormData({
      name: admin.name,
      email: admin.email,
      password: "", // Não preencher senha para edição
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (admin: Admin) => {
    setSelectedAdmin(admin);
    setIsDeleteModalOpen(true);
  };

  if (isContextLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-brand-orange" />
        <span className="ml-2 text-gray-400">Carregando informações...</span>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
        <h1 className="text-2xl font-bold">Gerenciar Administradores</h1>
        <button
          onClick={() => {
            setFormData({ name: "", email: "", password: "" });
            setFormErrors({});
            setIsAddModalOpen(true);
          }}
          className="flex items-center gap-2 bg-brand-orange hover:bg-brand-orange/90 text-white px-4 py-2.5 rounded-md transition-colors w-full sm:w-auto justify-center sm:justify-start"
        >
          <Plus size={18} />
          <span>Adicionar Administrador</span>
        </button>
      </div>

      {notification && (
        <div
          className={`mb-6 p-4 rounded-md flex items-start justify-between ${
            notification.type === "success"
              ? "bg-green-900/20 border border-green-800 text-green-300"
              : "bg-red-900/20 border border-red-800 text-red-300"
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === "success" ? (
              <Check className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            <span>{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-gray-400 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {error && (
        <div className="p-6 mb-6 bg-red-900/20 border border-red-800 rounded-md text-red-300">
          <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Erro ao carregar dados
          </h2>
          <p>{error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div className="p-6 flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin text-brand-orange" />
            <span className="ml-2 text-gray-400">Carregando administradores...</span>
          </div>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          {admins.length === 0 ? (
            <div className="p-6 text-center text-gray-400">
              Nenhum administrador encontrado.
            </div>
          ) : (
            <>
              {/* Versão para desktop - tabela */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-900 text-left">
                      <th className="p-4 font-semibold">Nome</th>
                      <th className="p-4 font-semibold">Email</th>
                      <th className="p-4 font-semibold">Criado em</th>
                      <th className="p-4 font-semibold">Criado por</th>
                      <th className="p-4 font-semibold text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {admins.map((admin) => (
                      <tr
                        key={admin.id}
                        className="hover:bg-gray-700/50 transition-colors"
                      >
                        <td className="p-4">{admin.name}</td>
                        <td className="p-4">{admin.email}</td>
                        <td className="p-4">
                          {new Date(admin.createdAt).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}
                        </td>
                        <td className="p-4">{admin.createdBy}</td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => openEditModal(admin)}
                            className="inline-flex items-center justify-center p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                            title="Editar"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => openDeleteModal(admin)}
                            className="inline-flex items-center justify-center p-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                            title="Excluir"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Versão para mobile - cards */}
              <div className="md:hidden divide-y divide-gray-700">
                {admins.map((admin) => (
                  <div key={admin.id} className="p-4 hover:bg-gray-700/50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium text-white">{admin.name}</h3>
                        <p className="text-sm text-gray-400">{admin.email}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEditModal(admin)}
                          className="inline-flex items-center justify-center p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                          aria-label="Editar"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => openDeleteModal(admin)}
                          className="inline-flex items-center justify-center p-2.5 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                          aria-label="Excluir"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm mt-3">
                      <div>
                        <p className="text-gray-500">Criado em</p>
                        <p>
                          {new Date(admin.createdAt).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Criado por</p>
                        <p>{admin.createdBy}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Modal de Adicionar Administrador */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-5 sm:p-6 w-full max-w-md my-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Adicionar Administrador</h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-white rounded-md hover:bg-gray-700 transition-colors"
                aria-label="Fechar"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddAdmin}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Nome
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-sm text-red-400">{formErrors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-sm text-red-400">
                      {formErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Senha
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                  />
                  {formErrors.password && (
                    <p className="mt-1 text-sm text-red-400">
                      {formErrors.password}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 sm:space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors w-full sm:w-auto text-center"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-3 bg-brand-orange hover:bg-brand-orange/90 text-white rounded-md transition-colors w-full sm:w-auto text-center"
                >
                  Adicionar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Editar Administrador */}
      {isEditModalOpen && selectedAdmin && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-5 sm:p-6 w-full max-w-md my-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                Editar: {selectedAdmin.name}
              </h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-white rounded-md hover:bg-gray-700 transition-colors"
                aria-label="Fechar"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleEditAdmin}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Nome
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-sm text-red-400">{formErrors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-sm text-red-400">
                      {formErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Nova Senha (deixe em branco para manter a atual)
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                  />
                  {formErrors.password && (
                    <p className="mt-1 text-sm text-red-400">
                      {formErrors.password}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 sm:space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors w-full sm:w-auto text-center"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors w-full sm:w-auto text-center"
                >
                  Atualizar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {isDeleteModalOpen && selectedAdmin && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-5 sm:p-6 w-full max-w-md my-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2 text-red-400">
                <AlertCircle className="h-5 w-5" />
                Confirmar Exclusão
              </h2>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-white rounded-md hover:bg-gray-700 transition-colors"
                aria-label="Fechar"
              >
                <X size={20} />
              </button>
            </div>
            <p className="mb-6">
              Tem certeza que deseja excluir o administrador{" "}
              <span className="font-semibold">{selectedAdmin.name}</span>?
              Esta ação não pode ser desfeita.
            </p>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 sm:space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors w-full sm:w-auto text-center"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteAdmin}
                className="px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors w-full sm:w-auto text-center"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}