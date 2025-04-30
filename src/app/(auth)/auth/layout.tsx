import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Acesso Restrito | Painel Administrativo | Guia TNN',
  description: 'Área de acesso restrito para administradores do Guia TNN. Faça login para gerenciar conteúdos, eventos e informações da plataforma.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}