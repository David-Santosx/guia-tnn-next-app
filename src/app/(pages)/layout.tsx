import Header from "@/components/header";
import Footer from "@/components/footer";
import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  metadataBase: new URL("https://guiatnn.com.br"),
  title: "MT 9 - Terra Nova do Norte | Seu guia completo sobre a cidade",
  description:
    "Descubra Terra Nova do Norte através do MT 9. Eventos, comércios, galeria de fotos e informações completas sobre a cidade no coração de Mato Grosso.",
  keywords:
    "Terra Nova do Norte, MT 9, Mato Grosso, turismo, eventos, comércios, galeria de fotos",
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
      <main>
        {children} <SpeedInsights />
      </main>
      <Footer />
    </>
  );
}
