import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Acesso Restrito | Painel Administrativo | MT 9',
  description: 'Área de acesso restrito para administradores do MT 9. Faça login para gerenciar conteúdos, eventos e informações da plataforma.',
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