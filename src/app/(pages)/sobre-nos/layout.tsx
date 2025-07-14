import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sobre o MT 9 | Conheça Nossa História e Equipe',
  description: 'Conheça a história, missão, valores e a equipe por trás do MT 9, o portal de informações sobre Terra Nova do Norte.',
  keywords: 'MT 9, sobre nós, equipe, missão, valores, Terra Nova do Norte, história',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://guiatnn.com.br/sobre-nos',
    title: 'Sobre o MT 9 | Conheça Nossa História e Equipe',
    description: 'Conheça a história, missão, valores e a equipe por trás do MT 9, o portal de informações sobre Terra Nova do Norte.',
    siteName: 'MT 9',
    images: [
      {
        url: '/brand/about-image-1.jpg',
        width: 1200,
        height: 630,
        alt: 'MT 9 - Sobre Nós',
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