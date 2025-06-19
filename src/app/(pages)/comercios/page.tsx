"use client";

import { useState, useEffect } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import CommerceCard from "@/components/comercios/commerce-card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Commerce {
  id: string;
  name: string;
  description: string;
  phone: string;
  rate: number;
  owner: string;
  hours: Record<string, string>;
  imageUrl: string;
  location: string;
  createdAt: string;
  updatedAt: string;
  category?: string; // <-- Adicionado campo opcional
}

export default function ComerciosPage() {
  const [comercios, setComercios] = useState<Commerce[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtros
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>("TODOS");
  const [busca, setBusca] = useState<string>("");

  useEffect(() => {
    const fetchComercios = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/comercios");

        if (!response.ok) {
          throw new Error("Falha ao buscar comércios");
        }

        const data = await response.json();
        setComercios(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
        console.error("Erro ao buscar comércios:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComercios();
  }, []);

  // Verificar se o comércio está aberto no momento atual
  const verificarAberto = (hours: Record<string, string>) => {
    if (!hours || Object.keys(hours).length === 0) return false;

    const agora = new Date();
    const diaSemana = format(agora, "EEEE", { locale: ptBR });
    const horaAtual = agora.getHours() * 60 + agora.getMinutes();

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

    let horarioHoje = null;

    // Verificar cada formato possível
    for (const formato of formatos) {
      if (hours[formato]) {
        horarioHoje = hours[formato];
        break;
      }
    }

    // Se não encontrar, verificar se existe alguma chave que contenha o dia da semana
    if (!horarioHoje) {
      for (const key of Object.keys(hours)) {
        if (key.toLowerCase().includes(diaSemana.split("-")[0].toLowerCase())) {
          horarioHoje = hours[key];
          break;
        }
      }
    }

    if (!horarioHoje || horarioHoje === "Fechado") return false;

    // Verificar se o formato é "HH:MM - HH:MM"
    if (!/\d{1,2}:\d{2}\s*-\s*\d{1,2}:\d{2}/.test(horarioHoje)) return false;

    const [abertura, fechamento] = horarioHoje.split("-").map((s) => s.trim());
    const [horaAbertura, minAbertura] = abertura.split(":").map(Number);
    const [horaFechamento, minFechamento] = fechamento.split(":").map(Number);

    const minutosAbertura = horaAbertura * 60 + minAbertura;
    const minutosFechamento = horaFechamento * 60 + minFechamento;

    return horaAtual >= minutosAbertura && horaAtual <= minutosFechamento;
  };

  // Obter categorias únicas dos comércios
  const categorias = [
    "TODOS",
    ...Array.from(new Set(comercios.map((c) => c.category).filter(Boolean))),
  ];

  // Filtrar comércios por categoria e busca
  const comerciosFiltrados = comercios.filter((comercio) => {
    const categoriaOk =
      categoriaFiltro === "TODOS" ||
      (comercio.category || "OUTROS") === categoriaFiltro;
    const buscaOk =
      busca.trim() === "" ||
      comercio.name.toLowerCase().includes(busca.toLowerCase()) ||
      (comercio.description &&
        comercio.description.toLowerCase().includes(busca.toLowerCase()));
    return categoriaOk && buscaOk;
  });

  // Separar abertos e fechados após filtro
  const comerciosAbertos = comerciosFiltrados.filter((comercio) =>
    verificarAberto(comercio.hours)
  );
  const comerciosFechados = comerciosFiltrados.filter(
    (comercio) => !verificarAberto(comercio.hours)
  );

  return (
    <main className="py-16 px-6 md:px-12 lg:px-16 bg-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-brand-blue mb-2">
          Comércios em Terra Nova do Norte
        </h1>

        <p className="text-gray-600 mb-8">
          Conheça os estabelecimentos comerciais da cidade e encontre o que você
          precisa
        </p>

        {/* Banner para adicionar comércio */}
        <div className="mb-4 rounded-xl bg-brand-blue/10 border border-brand-blue/20 p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-4 shadow-sm">
          <svg
            className="w-7 h-7 text-brand-blue shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
          <div className="flex-1">
            <span className="block font-semibold text-brand-blue">
              Tem um comércio e quer aparecer aqui?
            </span>
            <span className="block text-sm text-brand-blue/80 mt-1">
              Entre em contato conosco para adicionar seu estabelecimento à lista!
            </span>
          </div>
          <a
            href="mailto:guiatnn@hotmail.com?subject=Adicionar%20meu%20comércio%20em%20Terra%20Nova%20do%20Norte"
            className="w-full md:w-auto text-center bg-brand-blue text-white px-4 py-2 rounded-lg font-medium hover:bg-brand-blue/90 transition"
          >
            Entrar em contato
          </a>
        </div>

        {/* Âncora para o curso de design de sobrancelhas */}
        <div className="mb-8 rounded-xl bg-gradient-to-r from-pink-50 to-orange-50 border border-pink-200/20 p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-4 shadow-sm group transition-all hover:shadow-md">
          <div className="flex-1">
            <span className="block font-medium text-gray-900">
              Já pensou em ter seu próprio negócio?
            </span>
            <span className="block text-sm text-gray-600 mt-1">
              Seja uma profissional em design de sobrancelhas e comece sua história de sucesso em Terra Nova do Norte!
            </span>
          </div>
          <a
            href="https://lotustrainings.com/design-profissional-lotus?ref=C100377876A"
            target="_blank"
            rel="sponsored"
            className="w-full md:w-auto text-center inline-flex items-center justify-center bg-brand-orange text-white px-4 py-2 rounded-lg font-medium hover:bg-brand-orange/90 transition group-hover:translate-x-1"
          >
            Conhecer o curso
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        </div>

        {/* Filtros */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-stretch md:items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoria
            </label>
            <select
              className="w-full md:w-48 px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900"
              value={categoriaFiltro}
              onChange={(e) => setCategoriaFiltro(e.target.value)}
            >
              {categorias.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "TODOS"
                    ? "Todas as categorias"
                    : (cat ?? "Outros").charAt(0).toUpperCase() +
                      (cat ?? "Outros").slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buscar por nome ou descrição
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900"
              placeholder="Digite para buscar..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
        </div>

        {/* Estado de carregamento */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-brand-orange" />
            <span className="ml-3 text-gray-500">Carregando comércios...</span>
          </div>
        )}

        {/* Estado de erro */}
        {error && !isLoading && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span>Erro: {error}</span>
          </div>
        )}

        {/* Estado vazio */}
        {!isLoading && !error && comercios.length === 0 && (
          <div className="text-center py-16 px-4">
            <div className="max-w-md mx-auto">
              <svg
                className="mx-auto h-16 w-16 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Nenhum comércio encontrado
              </h3>
              <p className="mt-2 text-gray-500">
                Não encontramos comércios cadastrados no sistema.
              </p>
            </div>
          </div>
        )}

        {/* Lista de comércios abertos */}
        {!isLoading && !error && comerciosAbertos.length > 0 && (
          <section className="mb-12">
            <h2 className="flex flex-wrap items-center gap-3 mb-6">
              <div className="flex items-center">
                <span className="inline-block w-2 h-8 bg-brand-orange rounded-full mr-3"></span>
                <span className="text-2xl font-bold text-gray-800">Comércios Abertos Agora</span>
              </div>
              <span className="inline-flex items-center px-2.5 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full whitespace-nowrap">
                {comerciosAbertos.length} {comerciosAbertos.length === 1 ? 'local' : 'locais'}
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {comerciosAbertos.map((comercio) => (
                <CommerceCard
                  key={comercio.id}
                  commerce={comercio}
                  isOpen={true}
                />
              ))}
            </div>
          </section>
        )}

        {/* Lista de comércios fechados */}
        {!isLoading && !error && comerciosFechados.length > 0 && (
          <section>
            <h2 className="flex flex-wrap items-center gap-3 mb-6">
              <div className="flex items-center">
                <span className="inline-block w-2 h-8 bg-gray-300 rounded-full mr-3"></span>
                <span className="text-2xl font-bold text-gray-800">Comércios Fechados</span>
              </div>
              <span className="inline-flex items-center px-2.5 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full whitespace-nowrap">
                {comerciosFechados.length} {comerciosFechados.length === 1 ? 'local' : 'locais'}
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {comerciosFechados.map((comercio) => (
                <CommerceCard
                  key={comercio.id}
                  commerce={comercio}
                  isOpen={false}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}