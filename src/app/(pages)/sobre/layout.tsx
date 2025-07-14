import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sobre Terra Nova do Norte | História, Cultura e Natureza | MT 9',
  description: 'Conheça a história, natureza e cultura de Terra Nova do Norte. Informações sobre localização, fauna, flora e curiosidades desta cidade encantadora em Mato Grosso.',
  keywords: 'Terra Nova do Norte, história, cultura, natureza, fauna, flora, Mato Grosso, curiosidades',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://guiatnn.com.br/sobre',
    title: 'Sobre Terra Nova do Norte | História, Cultura e Natureza | MT 9',
    description: 'Conheça a história, natureza e cultura de Terra Nova do Norte. Informações sobre localização, fauna, flora e curiosidades desta cidade encantadora em Mato Grosso.',
    siteName: 'MT 9',
    images: [
      {
        url: '/images/historical/igreja-matriz.jpg',
        width: 1200,
        height: 630,
        alt: 'Terra Nova do Norte - História e Cultura',
      },
    ],
  },
};

export default function SobreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}