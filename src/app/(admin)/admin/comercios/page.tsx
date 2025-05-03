"use client";

import { useEffect, useState } from "react";
import { Plus, Loader2, AlertCircle } from "lucide-react";
import { CommerceTable } from "@/components/admin/comercios/commerce-table";
import { CommerceFormModal } from "@/components/admin/comercios/commerce-form-modal";

interface Commerce {
  id: string;
  name: string;
  description: string;
  phone: string;
  rate: number;
  owner: string;
  hours: Record<string, string>;
  imageUrl: string;
  location: string;
  createdAt: string;
  updatedAt: string;
}

export default function ComerciosPage() {
  const [comercios, setComercios] = useState<Commerce[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCommerce, setSelectedCommerce] = useState<Commerce | undefined>();

  const fetchComercios = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/comercios');
      if (!res.ok) throw new Error("Erro ao buscar comércios");
      const data = await res.json();
      setComercios(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComercios();
  }, []);

  const handleEditCommerce = (commerce: Commerce) => {
    setSelectedCommerce(commerce);
    setIsModalOpen(true);
  };

  const handleDeleteCommerce = async (commerceId: string) => {
    if (!confirm('Tem certeza que deseja excluir este comércio?')) return;

    try {
      const res = await fetch(`/api/comercios/${commerceId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Erro ao excluir comércio');
      await fetchComercios();
    } catch (err) {
      console.error('Erro ao excluir comércio:', err);
      alert('Erro ao excluir comércio');
    }
  };

  const handleAddCommerce = () => {
    setSelectedCommerce(undefined);
    setIsModalOpen(true);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <Loader2 className="h-8 w-8 animate-spin text-brand-orange" />
      <span className="ml-2 text-gray-400">Carregando comércios...</span>
    </div>
  );
  
  if (error) return (
    <div className="p-6 bg-red-900/20 border border-red-800 rounded-md text-red-300 flex items-center gap-3">
      <AlertCircle size={20} />
      <div>
        <h2 className="font-semibold mb-1">Erro ao carregar comércios</h2>
        <p className="text-sm">{error}</p>
      </div>
    </div>
  );

  return (
    <main className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Gerenciar Comércios</h1>
        <button
          onClick={handleAddCommerce}
          className="flex items-center gap-2 bg-brand-orange hover:bg-brand-orange/90 text-white px-4 py-2.5 rounded-md transition-colors w-full sm:w-auto justify-center sm:justify-start"
        >
          <Plus size={18} /> Novo Comércio
        </button>
      </div>
      <CommerceTable 
        comercios={comercios} 
        onEdit={handleEditCommerce}
        onDelete={handleDeleteCommerce}
      />
      <CommerceFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCommerceAdded={fetchComercios}
        commerce={selectedCommerce}
      />
    </main>
  );
}