import Link from "next/link";

export default function AnuncieConoscoPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-16 px-6">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <h1 className="text-3xl font-bold text-brand-blue mb-4">Anuncie Conosco</h1>
        <p className="text-gray-700 mb-6">
          Divulgue sua marca, produto ou serviço para milhares de pessoas em Terra Nova do Norte e região!
        </p>
        <ul className="mb-6 list-disc pl-6 text-gray-700 space-y-2">
          <li>Espaços exclusivos para banners e anúncios em posições de destaque.</li>
          <li>Planos flexíveis para diferentes necessidades e orçamentos.</li>
          <li>Alcance moradores, visitantes e empreendedores locais.</li>
        </ul>
        <div className="mb-6">
          <p className="font-semibold text-brand-blue mb-2">Entre em contato:</p>
          <p>
            <a href="mailto:guiatnn@hotmail.com" className="text-brand-orange hover:underline">
              guiatnn@hotmail.com
            </a>
            <br />
            <a href="tel:+5566999118905" className="text-brand-orange hover:underline">
              (66) 99911-8905
            </a>
          </p>
        </div>
        <Link
          href="/"
          className="inline-block bg-brand-blue text-white px-6 py-2 rounded-md hover:bg-brand-orange transition-colors"
        >
          Voltar para o início
        </Link>
      </div>
    </main>
  );
}