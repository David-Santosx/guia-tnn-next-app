
import { Suspense } from "react";
// Componentes
import EventCalendar from "@/components/eventos/event-calendar";
import EventCard from "@/components/eventos/event-card";
import Skeleton from "@/components/ui/skeleton";

// Tipos
interface Event {
  id: string;
  title: string;
  description: string;
  organization: string;
  date: string;
  time: string;
  location: string;
  imageUrl: string;
  createdAt: string;
  createdBy: string;
}

// Função para buscar eventos (simulada por enquanto)
async function getEvents(): Promise<Event[]> {
  const res = await fetch("api/eventos"); // Removed cache: 'no-store'
  if (!res.ok) throw new Error("Erro ao buscar eventos");
  return res.json();
}

// Componente de carregamento para eventos
function EventsLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
          <Skeleton className="h-48 w-full" />
          <div className="p-4 space-y-3">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <div className="pt-2 space-y-2">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Componente principal da página de eventos
export default async function EventosPage() {
  const events = await getEvents();
  
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-brand-blue mb-2 text-center">
          Eventos em Terra Nova do Norte
        </h1>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
          Confira os próximos eventos da cidade e participe das atividades culturais, esportivas e sociais.
        </p>
        
        {/* Seção do Calendário */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-brand-blue mb-6">
            Calendário de Eventos
          </h2>
          <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
            <Suspense fallback={<div className="h-96 flex items-center justify-center"><Skeleton className="h-80 w-full" /></div>}>
              <EventCalendar events={events} />
            </Suspense>
          </div>
        </section>
        
        {/* Lista de Eventos */}
        <section>
          <h2 className="text-2xl font-semibold text-brand-blue mb-6">
            Próximos Eventos
          </h2>
          <Suspense fallback={<EventsLoading />}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </Suspense>
        </section>
      </div>
    </main>
  );
}