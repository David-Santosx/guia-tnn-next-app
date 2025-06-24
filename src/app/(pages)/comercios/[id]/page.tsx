import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Commerce } from "@/app/(pages)/comercios/page"; // Ajuste o import conforme o local do tipo
import Image from "next/image";

async function getCommerce(id: string): Promise<Commerce | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/comercios/${id}`);
  if (!res.ok) return null;
  return res.json();
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const commerce = await getCommerce(params.id);
  if (!commerce) return {};
  const url = `${process.env.NEXT_PUBLIC_URL}/comercios/${params.id}`;
  return {
    title: `${commerce.name} | Comércio em Terra Nova do Norte`,
    description: commerce.description || `Confira informações sobre ${commerce.name} em Terra Nova do Norte.`,
    openGraph: {
      title: `${commerce.name} | Comércio em Terra Nova do Norte`,
      description: commerce.description || `Confira informações sobre ${commerce.name} em Terra Nova do Norte.`,
      url,
      images: [
        {
          url: commerce.imageUrl,
          width: 800,
          height: 600,
          alt: commerce.name,
        },
      ],
      type: "article",
      siteName: "Guia TNN",
    },
    twitter: {
      card: "summary_large_image",
      title: `${commerce.name} | Comércio em Terra Nova do Norte`,
      description: commerce.description || `Confira informações sobre ${commerce.name} em Terra Nova do Norte.`,
      images: [commerce.imageUrl],
    },
    alternates: {
      canonical: url,
    },
    keywords: [
      commerce.name,
      commerce.category || "",
      "Terra Nova do Norte",
      "comércio local",
      "Guia TNN",
      ...(commerce.description ? commerce.description.split(" ") : []),
    ],
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderHours(hours: any) {
  if (!hours) return <span>Não informado</span>;
  if (typeof hours === "string") {
    try {
      hours = JSON.parse(hours);
    } catch {
      return <span>{hours}</span>;
    }
  }
  if (typeof hours === "object") {
    return (
      <ul className="list-disc pl-5">
        {Object.entries(hours).map(([day, value]) => (
          <li key={day}>
            <strong>{day}:</strong> {String(value)}
          </li>
        ))}
      </ul>
    );
  }
  return <span>{String(hours)}</span>;
}

export default async function CommercePage({ params }: { params: { id: string } }) {
  const commerce = await getCommerce(params.id);
  if (!commerce) return notFound();

  return (
    <main className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-4">{commerce.name}</h1>
      <Image src={commerce.imageUrl} alt={commerce.name} width={600} height={340} className="rounded-xl mb-6" />
      <p className="mb-4">{commerce.description}</p>
      <div className="mb-2"><strong>Telefone:</strong> {commerce.phone || "Não informado"}</div>
      <div className="mb-2"><strong>Endereço:</strong> {commerce.location || "Não informado"}</div>
      <div className="mb-2"><strong>Categoria:</strong> {commerce.category || "Não informado"}</div>
      <div className="mb-2">
        <strong>Horário de funcionamento:</strong> {renderHours(commerce.hours)}
      </div>
      {/* Adicione mais detalhes conforme necessário */}
    </main>
  );
}