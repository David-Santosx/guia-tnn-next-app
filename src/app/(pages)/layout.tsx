import Header from "@/components/header";
import Footer from "@/components/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://guiatnn.com.br"),
  title: "Guia TNN - Terra Nova do Norte | Seu guia completo sobre a cidade",
  description:
    "Descubra Terra Nova do Norte através do Guia TNN. Eventos, comércios, galeria de fotos e informações completas sobre a cidade no coração de Mato Grosso.",
  keywords:
    "Terra Nova do Norte, Guia TNN, Mato Grosso, turismo, eventos, comércios, galeria de fotos",
  // ... outras meta tags conforme necessário
};

export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <head>
        <meta name="google-adsense-account" content="ca-pub-1306875437034957" />
      </head>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
