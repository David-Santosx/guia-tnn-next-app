"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit, Loader2, AlertCircle } from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AdFormModal } from "@/components/admin/ads/ad-form-modal";

interface Advertisement {
  id: string;
  title: string;
  imageUrl: string;
  position: number;
  isActive: boolean;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export default function AnunciosPage() {
  const [anuncios, setAnuncios] = useState<Advertisement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAnuncio, setSelectedAnuncio] = useState<Advertisement | null>(null);

  const fetchAnuncios = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/anuncios");
      if (!response.ok) {
        throw new Error("Falha ao buscar anúncios");
      }
      const data = await response.json();
      setAnuncios(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erro desconhecido");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnuncios();
  }, []);

  const handleEditAnuncio = (anuncio: Advertisement) => {
    setSelectedAnuncio(anuncio);
    setIsEditModalOpen(true);
  };

  const handleDeleteAnuncio = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este anúncio?")) return;

    try {
      const response = await fetch(`/api/anuncios/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Falha ao excluir anúncio");
      }

      fetchAnuncios();
    } catch (error) {
      console.error("Erro ao excluir anúncio:", error);
      setError(error instanceof Error ? error.message : "Erro desconhecido");
    }
  };

  const getPositionName = (position: number) => {
    switch (position) {
      case 0:
        return "Topo";
      case 1:
        return "Lateral Esquerda";
      case 2:
        return "Lateral Direita";
      default:
        return "Desconhecida";
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return "Data inválida";
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gerenciar Anúncios</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-brand-orange text-white rounded-md hover:bg-brand-orange/90 transition-colors text-sm font-medium"
        >
          <Plus size={18} />
          Adicionar Anúncio
        </button>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-brand-orange" />
          <span className="ml-2 text-gray-400">Carregando anúncios...</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-900/20 border border-red-800 rounded-md text-red-300 flex items-center gap-3">
          <AlertCircle size={20} />
          <div>
            <h2 className="font-semibold mb-1">Erro ao carregar anúncios</h2>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {!isLoading && !error && anuncios.length === 0 && (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-500">
          <p className="text-lg font-medium">Nenhum anúncio encontrado.</p>
          <p>Clique em &quot;Adicionar Anúncio&quot; para começar.</p>
        </div>
      )}

      {!isLoading && !error && anuncios.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Imagem
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Título
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Posição
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Data de Início
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Data de Término
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {anuncios.map((anuncio) => (
                <tr key={anuncio.id} className="hover:bg-gray-700/50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="w-16 h-16 relative rounded overflow-hidden">
                      <Image
                        src={anuncio.imageUrl}
                        alt={anuncio.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm text-white">{anuncio.title}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm text-white">
                      {getPositionName(anuncio.position)}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        anuncio.isActive
                          ? "bg-green-900/30 text-green-300"
                          : "bg-red-900/30 text-red-300"
                      }`}
                    >
                      {anuncio.isActive ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                    {formatDate(anuncio.startDate)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                    {formatDate(anuncio.endDate)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEditAnuncio(anuncio)}
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                        title="Editar"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteAnuncio(anuncio.id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                        title="Excluir"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal para adicionar anúncio */}
      <AdFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdSubmitted={fetchAnuncios}
      />

      {/* Modal para editar anúncio */}
      <AdFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onAdSubmitted={fetchAnuncios}
        ad={selectedAnuncio || undefined}
      />
    </div>
  );
}