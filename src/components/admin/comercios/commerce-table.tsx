import { Edit, Trash2, Star } from "lucide-react";
import Image from "next/image";

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
  category: string; // <-- Adicionado campo categoria
  createdAt: string;
  updatedAt: string;
}

interface CommerceTableProps {
  comercios: Commerce[];
  onEdit: (commerce: Commerce) => void;
  onDelete: (id: string) => void;
}

export function CommerceTable({
  comercios,
  onEdit,
  onDelete,
}: CommerceTableProps) {
  if (comercios.length === 0) {
    return (
      <div className="text-center py-10 bg-gray-800/50 rounded-lg border border-gray-700">
        <p className="text-gray-400">Nenhum comércio cadastrado.</p>
        <p className="text-gray-500 text-sm mt-1">
          Clique em &quot;Novo Comércio&quot; para adicionar.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
        <thead className="bg-gray-700">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Imagem
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Nome
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Proprietário
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Telefone
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Avaliação
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Localização
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Categoria
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {comercios.map((comercio) => (
            <tr key={comercio.id} className="hover:bg-gray-700/50">
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="w-16 h-16 relative rounded overflow-hidden">
                  <Image
                    src={comercio.imageUrl}
                    alt={comercio.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="text-sm text-white">{comercio.name}</div>
                <div className="text-xs text-gray-400 truncate max-w-[200px]">
                  {comercio.description}
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                {comercio.owner}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                {comercio.phone}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="text-sm text-gray-300">{comercio.rate}</span>
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                {comercio.location}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                {comercio.category}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onEdit(comercio)}
                  className="text-indigo-400 hover:text-indigo-300 mr-3"
                  title="Editar"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => onDelete(comercio.id)}
                  className="text-red-400 hover:text-red-300"
                  title="Excluir"
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}