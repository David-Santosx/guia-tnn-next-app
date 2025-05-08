import type { Metadata } from 'next';

// Metadados estáticos para todos os eventos
export const metadata: Metadata = {
  title: 'Detalhes do Evento | Guia TNN',
  description: 'Confira os detalhes deste evento em Terra Nova do Norte.',
  keywords: 'eventos, Terra Nova do Norte, Mato Grosso, agenda cultural',
  openGraph: {
    type: "article",
    locale: "pt_BR",
    url: "https://guiatnn.com.br/eventos/",
    title: "Eventos em Terra Nova do Norte | Guia TNN",
    description: "Confira os detalhes deste evento em Terra Nova do Norte.",
    siteName: "Guia TNN",
  },
};

export default function EventoDetalheLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}