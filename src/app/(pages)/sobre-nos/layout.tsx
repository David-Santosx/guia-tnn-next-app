import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sobre o Guia TNN | Conheça Nossa História e Equipe',
  description: 'Conheça a história, missão, valores e a equipe por trás do Guia TNN, o portal de informações sobre Terra Nova do Norte.',
  keywords: 'Guia TNN, sobre nós, equipe, missão, valores, Terra Nova do Norte, história',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://guiatnn.com.br/sobre-nos',
    title: 'Sobre o Guia TNN | Conheça Nossa História e Equipe',
    description: 'Conheça a história, missão, valores e a equipe por trás do Guia TNN, o portal de informações sobre Terra Nova do Norte.',
    siteName: 'Guia TNN',
    images: [
      {
        url: '/brand/about-image-1.jpg',
        width: 1200,
        height: 630,
        alt: 'Guia TNN - Sobre Nós',
      },
    ],
  },
};

export default function SobreNosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}