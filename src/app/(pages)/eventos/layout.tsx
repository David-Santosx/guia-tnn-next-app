import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Eventos em Terra Nova do Norte | Calendário e Próximos Eventos | MT 9',
  description: 'Confira os próximos eventos em Terra Nova do Norte. Calendário completo de atividades culturais, esportivas e sociais da cidade.',
  keywords: 'eventos Terra Nova do Norte, agenda cultural, calendário de eventos, festas, shows, Mato Grosso',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://guiatnn.com.br/eventos',
    title: 'Eventos em Terra Nova do Norte | Calendário e Próximos Eventos | MT 9',
    description: 'Confira os próximos eventos em Terra Nova do Norte. Calendário completo de atividades culturais, esportivas e sociais da cidade.',
    siteName: 'MT 9',
  },
};

export default function EventosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}