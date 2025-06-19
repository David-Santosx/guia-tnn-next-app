import Image from "next/image";
import { Info, Star, Users, Clock, Award } from "lucide-react";

export function AffiliateBanner() {
  return (
    <div className="relative my-8 rounded-xl overflow-hidden bg-white border border-brand-blue/10 shadow-lg">
      {/* Indicador de publicidade */}
      <div className="absolute top-0 left-0 bg-black/40 text-white text-[6px] px-2 py-1 z-50 rounded-br-md flex flex-col items-center justify-center group">
        <Info className="w-3 h-3" />
        <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute left-full ml-2 bg-black text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap pointer-events-none">
          Publicidade
        </span>
      </div>

      {/* Faixa decorativa superior */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-pink-400 via-brand-orange to-brand-blue" />
      
      <div className="relative flex flex-col md:flex-row items-center gap-6 p-6">
        {/* Conteúdo Principal */}
        <div className="flex-1 space-y-4">
          {/* Cabeçalho */}
          <div className="flex items-center gap-2">
            <span className="bg-pink-100 text-pink-600 text-xs font-semibold px-3 py-1 rounded-full">
              Oportunidade em Terra Nova do Norte
            </span>
          </div>

          {/* Título e Subtítulo */}
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">
              Transforme sua Vida com Design de Sobrancelhas
            </h3>
            <p className="text-gray-600">
              Curso completo de Design de Sobrancelhas e Depilação Facial
            </p>
          </div>

          {/* Métricas */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-2">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-brand-orange" />
              <span className="text-sm text-gray-700">+24.200 alunas</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-brand-orange" />
              <span className="text-sm text-gray-700">94% aprovação</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-orange" />
              <span className="text-sm text-gray-700">16h de conteúdo</span>
            </div>
          </div>

          {/* Benefícios */}
          <div className="grid grid-cols-2 gap-3">
            {[
              "39 aulas práticas",
              "Garantia de 7 dias",
              "Certificado incluso",
              "Suporte especializado"
            ].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <Award className="w-4 h-4 text-brand-blue" />
                <span className="text-sm text-gray-700">{item}</span>
              </div>
            ))}
          </div>

          {/* Preço e CTA */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
            <div>
              <div className="text-2xl font-bold text-brand-blue">
                R$ 29,90
              </div>
              <div className="text-xs text-gray-500">
                em até 4x de R$ 8,14 no cartão
              </div>
            </div>
            <a
              href="https://lotustrainings.com/design-profissional-lotus?ref=C100377876A"
              target="_blank"
              rel="noopener sponsored"
              className="inline-block bg-brand-blue text-white font-semibold px-6 py-3 rounded-lg hover:bg-brand-orange transition-colors duration-200 shadow-md"
            >
              Começar Agora
            </a>
          </div>
        </div>

        {/* Imagem Lateral */}
        <div className="hidden md:block w-72">
          <Image
            src="https://static-media.hotmart.com/hoaNaKG43Un6nXkhpxBpYW1bl7c=/300x300/smart/filters:format(webp):background_color(white)/hotmart/product_pictures/3c5f8fe0-3ecf-4bd9-a842-51cd7aae95b8/11.png?w=920"
            alt="Design de Sobrancelhas Profissional"
            width={300}
            height={300}
            className="rounded-lg shadow-md"
          />
        </div>
      </div>
    </div>
  );
}