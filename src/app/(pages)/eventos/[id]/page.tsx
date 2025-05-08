import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, MapPin, Building, ArrowLeft } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Event } from "@/types/event";

async function getEventById(id: string): Promise<Event | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/eventos/${id}`,
      {
        next: { revalidate: 0 },
      }
    );
    if (!res.ok) return null;
    const event = await res.json();
    console.log(event.createdBy);
    return event;
  } catch {
    return null;
  }
}

// Componente principal da página de detalhes do evento
export default async function EventoDetalhePage({
  params,
}: {
  params: { id: string };
}) {
  const event = await getEventById(params.id);

  // Se o evento não for encontrado, retorna 404
  if (!event) {
    notFound();
  }

  // Formatar a data para exibição
  const formattedDate = format(parseISO(event.date), "dd 'de' MMMM 'de' yyyy", {
    locale: ptBR,
  });

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Botão voltar */}
        <Link
          href="/eventos"
          className="inline-flex items-center text-brand-blue hover:text-brand-orange transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Voltar para eventos
        </Link>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Imagem do evento */}
          <div className="relative h-64 md:h-96 w-full">
            <Image
              src={event.imageUrl}
              alt={event.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {event.title}
              </h1>
              <div className="flex items-center text-sm md:text-base">
                <Calendar className="w-5 h-5 mr-2 text-brand-orange" />
                <span>
                  {formattedDate} às {event.time}
                </span>
              </div>
            </div>
          </div>

          {/* Conteúdo do evento */}
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Coluna principal com descrição */}
              <div className="md:col-span-2 space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-brand-blue mb-3">
                    Sobre o evento
                  </h2>
                  <p className="text-gray-700 whitespace-pre-line">
                    {event.description}
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-brand-blue mb-3">
                    Organização
                  </h2>
                  <div className="flex items-center">
                    <Building className="w-5 h-5 mr-3 text-brand-orange" />
                    <span className="text-gray-700">{event.organization}</span>
                  </div>
                </div>
              </div>

              {/* Coluna lateral com informações adicionais */}
              <div className="bg-gray-50 rounded-lg p-5 space-y-5">
                <div>
                  <h3 className="font-medium text-brand-blue mb-3">
                    Informações
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-700">
                      <Calendar className="w-5 h-5 mr-3 text-brand-orange" />
                      <span>{formattedDate}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Clock className="w-5 h-5 mr-3 text-brand-orange" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <MapPin className="w-5 h-5 mr-3 text-brand-orange" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}