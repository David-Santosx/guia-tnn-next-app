import { Event } from "@/types/event";
import { Pencil, Trash2 } from "lucide-react";

interface EventTableProps {
  events: Event[];
  onEdit: (event: Event) => void;
  onDelete: (eventId: string) => void;
}

export function EventTable({ events, onEdit, onDelete }: EventTableProps) {
  if (!events.length) {
    return <div className="text-gray-400 text-center py-8">Nenhum evento cadastrado.</div>;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-700 bg-gray-800">
      <table className="min-w-full divide-y divide-gray-700">
        <thead>
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Título</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Data</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Hora</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Local</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {events.map(event => (
            <tr key={event.id} className="hover:bg-gray-700/50 transition-colors">
              <td className="px-4 py-3 text-sm font-medium text-white">{event.title}</td>
              <td className="px-4 py-3 text-sm text-gray-300">{formatDate(event.date)}</td>
              <td className="px-4 py-3 text-sm text-gray-300">{formatTime(event.date)}</td>
              <td className="px-4 py-3 text-sm text-gray-300">{event.location}</td>
              <td className="px-4 py-3 text-sm space-x-2">
                <button
                  onClick={() => onEdit(event)}
                  className="text-brand-orange hover:text-brand-orange/80 transition-colors p-1 rounded-md"
                  title="Editar evento"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => onDelete(event.id)}
                  className="text-red-500 hover:text-red-400 transition-colors p-1 rounded-md"
                  title="Excluir evento"
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}