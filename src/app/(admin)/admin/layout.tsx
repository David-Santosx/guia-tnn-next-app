import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Painel Administrativo | MT 9',
  description: 'Painel administrativo para gerenciamento de conteúdos do MT 9.',
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