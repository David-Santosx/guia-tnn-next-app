import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Painel Administrativo | Guia TNN',
  description: 'Painel administrativo para gerenciamento de conteúdos do Guia TNN.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}