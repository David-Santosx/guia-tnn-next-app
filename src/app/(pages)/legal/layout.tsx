import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Informações Legais | Terra Nova do Norte | Guia TNN',
  description: 'Informações legais, termos de uso e política de privacidade do Guia Terra Nova do Norte.',
  keywords: 'termos de uso, política de privacidade, legal, Guia TNN, Terra Nova do Norte',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://guiatnn.com.br/legal',
    title: 'Informações Legais | Terra Nova do Norte | Guia TNN',
    description: 'Informações legais, termos de uso e política de privacidade do Guia Terra Nova do Norte.',
    siteName: 'Guia TNN',
  },
};

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}