
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
  const res = await fetch("http://localhost:3000/api/eventos"); // Removed cache: 'no-store'
  if (!res.ok) throw new Error("Erro ao buscar eventos");
  return res.json();
}

// Função para classificar eventos por data
function categorizeEvents(events: Event[]) {
  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);
  
  const pastEvents: Event[] = [];
  const upcomingEvents: Event[] = [];
  const futureEvents: Event[] = [];
  
  events.forEach(event => {
    const eventDate = new Date(event.date);
    
    if (eventDate < today) {
      pastEvents.push(event);
    } else if (eventDate <= nextWeek) {
      upcomingEvents.push(event);
    } else {
      futureEvents.push(event);
    }
  });
  
  return { pastEvents, upcomingEvents, futureEvents };
}

// Componente principal da página de eventos
export default async function EventosPage() {
  const events = await getEvents();
  const { pastEvents, upcomingEvents, futureEvents } = categorizeEvents(events);
  
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
          {upcomingEvents.length > 0 && (
            <>
              <h2 className="text-2xl font-semibold text-green-600 mb-6 flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                Eventos Próximos (Próximos 7 dias)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {upcomingEvents.map((event) => (
                  <EventCard 
                    key={event.id} 
                    event={event} 
                    className="border-l-4 border-green-500 shadow-md hover:shadow-lg transition-shadow"
                  />
                ))}
              </div>
            </>
          )}
          
          {futureEvents.length > 0 && (
            <>
              <h2 className="text-2xl font-semibold text-blue-600 mb-6 flex items-center">
                <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                Eventos Futuros
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {futureEvents.map((event) => (
                  <EventCard 
                    key={event.id} 
                    event={event} 
                    className="border-l-4 border-blue-500 shadow-md hover:shadow-lg transition-shadow"
                  />
                ))}
              </div>
            </>
          )}
          
          {pastEvents.length > 0 && (
            <>
              <h2 className="text-2xl font-semibold text-gray-600 mb-6 flex items-center">
                <span className="w-3 h-3 bg-gray-500 rounded-full mr-2"></span>
                Eventos Passados
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastEvents.map((event) => (
                  <EventCard 
                    key={event.id} 
                    event={event} 
                    className="border-l-4 border-gray-400 shadow-md hover:shadow-lg transition-shadow opacity-75"
                  />
                ))}
              </div>
            </>
          )}
          
          {events.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Nenhum evento encontrado.</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}