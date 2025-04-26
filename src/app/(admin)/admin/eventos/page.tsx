'use client'
import { useEffect, useState } from "react";
import { Event } from "@/types/event";
import { EventTable } from "@/components/admin/eventos/event-table";
import { EventFormModal } from '@/components/admin/eventos/event-form';
import { Plus } from "lucide-react";

export default function AdminEventosPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | undefined>();

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/eventos');
      if (!res.ok) throw new Error("Erro ao buscar eventos");
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Tem certeza que deseja excluir este evento?')) return;

    try {
      const res = await fetch(`/api/eventos/${eventId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Erro ao excluir evento');
      await fetchEvents();
    } catch (err) {
      console.error('Erro ao excluir evento:', err);
      alert('Erro ao excluir evento');
    }
  };

  const handleAddEvent = () => {
    setSelectedEvent(undefined);
    setIsModalOpen(true);
  };

  if (loading) return <div className="p-8">Carregando eventos...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <main className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Gerenciar Eventos</h1>
        <button
          onClick={handleAddEvent}
          className="flex items-center gap-2 bg-brand-orange hover:bg-brand-orange/90 text-white px-4 py-2.5 rounded-md transition-colors w-full sm:w-auto justify-center sm:justify-start"
        >
          <Plus size={18} /> Novo Evento
        </button>
      </div>
      <EventTable 
        events={events} 
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
      />
      <EventFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onEventAdded={fetchEvents}
        event={selectedEvent}
      />
    </main>
  );
}