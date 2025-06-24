import { Star, Phone, MapPin, Clock } from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";

interface CommerceCardProps {
  commerce: {
    id: string;
    name: string;
    description: string;
    phone: string;
    rate: number;
    hours: Record<string, string>;
    imageUrl: string;
    location: string;
    category?: string; // <-- Adicionado campo opcional
  };
  isOpen: boolean;
}

export default function CommerceCard({ commerce, isOpen }: CommerceCardProps) {
  const { name, description, phone, rate, hours, imageUrl, location } =
    commerce;

  // Formatar o número de telefone para exibição
  const formatPhone = (phone: string) => {
    // Remover caracteres não numéricos
    const cleaned = phone.replace(/\D/g, "");

    // Verificar se é um número de celular (9 dígitos após o DDD) ou fixo (8 dígitos após o DDD)
    if (cleaned.length === 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(
        7
      )}`;
    } else if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(
        6
      )}`;
    }

    // Retornar o número original se não corresponder aos formatos esperados
    return phone;
  };

  // Obter o horário de hoje
  const getHorarioHoje = () => {
    // Obter o dia da semana atual em português
    const diaSemana = format(new Date(), "EEEE", { locale: ptBR });

    // Verificar se o objeto hours existe e tem propriedades
    if (!hours || Object.keys(hours).length === 0) {
      return "Não informado";
    }

    // Verificar se o dia da semana está no formato correto (primeira letra maiúscula)
    const diaSemanaFormatado =
      diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1);

    // Tentar diferentes formatos possíveis do dia da semana
    const formatos = [
      diaSemana, // "segunda-feira"
      diaSemanaFormatado, // "Segunda-feira"
      diaSemana.split("-")[0], // "segunda"
      diaSemanaFormatado.split("-")[0], // "Segunda"
    ];

    // Verificar cada formato possível
    for (const formato of formatos) {
      if (hours[formato]) {
        return hours[formato];
      }
    }

    // Se não encontrar, verificar se existe alguma chave que contenha o dia da semana
    for (const key of Object.keys(hours)) {
      if (key.toLowerCase().includes(diaSemana.split("-")[0].toLowerCase())) {
        return hours[key];
      }
    }

    // Exibir todas as chaves disponíveis para depuração
    console.log("Chaves disponíveis em hours:", Object.keys(hours));
    console.log("Dia da semana atual:", diaSemana);

    return "Não informado";
  };

  // Renderizar estrelas de avaliação
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    // Estrelas cheias
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`full-${i}`}
          className="w-4 h-4 fill-brand-orange text-brand-orange"
        />
      );
    }

    // Meia estrela
    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="w-4 h-4 text-brand-orange" />
          <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
            <Star className="w-4 h-4 fill-brand-orange text-brand-orange" />
          </div>
        </div>
      );
    }

    // Estrelas vazias
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-4 h-4 text-brand-orange" />
      );
    }

    return stars;
  };

  return (
    <Link href={`/comercios/${commerce.id}`} className="block group">
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col border border-gray-100 group-hover:border-brand-orange/20">
        {/* Imagem do comércio */}
        <div className="relative aspect-video">
          <Image
            src={imageUrl || "/placeholder-commerce.jpg"}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Badge de status (aberto/fechado) */}
          <div
            className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium shadow-sm backdrop-blur-sm ${
              isOpen ? "bg-green-500/90 text-white" : "bg-gray-900/90 text-white"
            }`}
          >
            {isOpen ? "Aberto agora" : "Fechado"}
          </div>

          {/* Avaliação */}
          <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm flex items-center">
            <div className="flex items-center space-x-0.5">
              {renderStars(rate)}
            </div>
            <span className="ml-2 text-xs font-semibold text-gray-700 border-l border-gray-200 pl-2">
              {rate.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Conteúdo do card */}
        <div className="p-5 flex-grow flex flex-col">
          <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-brand-blue transition-colors">
            {name}
          </h3>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
            {description}
          </p>

          {commerce.category && (
            <div className="mb-4">
              <span className="inline-block bg-brand-orange/10 text-brand-orange text-xs px-3 py-1.5 rounded-full font-semibold">
                {commerce.category}
              </span>
            </div>
          )}

          <div className="mt-auto space-y-3">
            {/* Telefone */}
            <div className="flex items-center text-sm text-gray-700 hover:text-brand-orange transition-colors">
              <Phone className="w-4 h-4 text-brand-orange mr-2.5" />
              <span className="font-medium">{formatPhone(phone)}</span>
            </div>

            {/* Localização */}
            <div className="flex items-center text-sm text-gray-700 hover:text-brand-orange transition-colors">
              <MapPin className="w-4 h-4 text-brand-orange mr-2.5" />
              <span className="line-clamp-1 font-medium">{location}</span>
            </div>

            {/* Horário de hoje */}
            <div className="flex items-center text-sm text-gray-700">
              <Clock className="w-4 h-4 text-brand-orange mr-2.5" />
              <span className="font-medium">Hoje: {getHorarioHoje()}</span>
            </div>

            {/* Observação sobre feriados */}
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-start space-x-2">
                <span className="text-xs text-gray-500 italic leading-relaxed">
                  * Os horários podem ser diferentes em feriados e datas especiais
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}