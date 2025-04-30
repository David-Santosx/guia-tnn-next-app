import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Galeria de Fotos | Terra Nova do Norte | Guia TNN',
  description: 'Explore a galeria de fotos de Terra Nova do Norte. Imagens da cidade, eventos, natureza e momentos especiais capturados em Mato Grosso.',
  keywords: 'galeria de fotos, Terra Nova do Norte, imagens, fotografias, Mato Grosso, paisagens',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://guiatnn.com.br/galeria',
    title: 'Galeria de Fotos | Terra Nova do Norte | Guia TNN',
    description: 'Explore a galeria de fotos de Terra Nova do Norte. Imagens da cidade, eventos, natureza e momentos especiais capturados em Mato Grosso.',
    siteName: 'Guia TNN',
  },
};

export default function GaleriaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}