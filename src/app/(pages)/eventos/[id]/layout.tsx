import type { Metadata } from 'next';
import { getEventById } from '@/app/actions/events';

// Função para gerar metadados dinâmicos com base no ID do evento
export async function generateMetadata({ 
  params 
}: { 
  params: { id: string } 
}): Promise<Metadata> {
  const id = params.id;
  const event = await getEventById(id);
  
  if (!event) {
    return {
      title: 'Evento não encontrado | Guia TNN',
      description: 'O evento solicitado não foi encontrado no Guia TNN.',
    };
  }

  const formattedDate = new Date(event.date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return {
    title: `${event.title} | Evento em ${event.location} | Guia TNN`,
    description: `${event.description.substring(0, 160)}... Evento em ${event.location} no dia ${formattedDate} às ${event.time}.`,
    keywords: `${event.title}, eventos Terra Nova do Norte, ${event.location}, ${formattedDate}`,
    openGraph: {
      // Using 'article' type since 'event' is not a valid OpenGraph type
      type: 'article',
      locale: 'pt_BR',
      url: `https://guiatnn.com.br/eventos/`,
      title: `${event.title} | Evento em ${event.location} | Guia TNN`,
      description: `${event.description.substring(0, 160)}... Evento em ${event.location} no dia ${formattedDate} às ${event.time}.`,
      siteName: 'Guia TNN',
      images: [
        {
          url: event.imageUrl,
          width: 1200,
          height: 630,
          alt: event.title,
        },
      ],
    },
  };
}

export default function EventoDetalheLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}