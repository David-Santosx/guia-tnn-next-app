import type { Metadata } from 'next';

// Metadados estáticos para todos os eventos
export const metadata: Metadata = {
  title: 'Detalhes do Evento | MT 9',
  description: 'Confira os detalhes deste evento em Terra Nova do Norte.',
  keywords: 'eventos, Terra Nova do Norte, Mato Grosso, agenda cultural',
  openGraph: {
    type: "article",
    locale: "pt_BR",
    url: "https://guiatnn.com.br/eventos/",
    title: "Eventos em Terra Nova do Norte | MT 9",
    description: "Confira os detalhes deste evento em Terra Nova do Norte.",
    siteName: "MT 9",
  },
};

export default function EventoDetalheLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}