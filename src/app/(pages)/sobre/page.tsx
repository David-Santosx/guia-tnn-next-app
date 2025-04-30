'use client';

import ScrollReveal from '@/components/ui/scroll-reveal';
import HistoricalCarousel from "@/components/ui/historical-carousel";
import {
  MapPin,
  Leaf,
  History,
  Bird,
  Trees,
  Users,
  Info,
  ExternalLink,
} from "lucide-react";

// Dados das fotos históricas
const historicalPhotos = [
  {
    id: 1,
    title: "Primeiros colonizadores (1978)",
    description:
      "Famílias gaúchas chegando à região que viria a se tornar Terra Nova do Norte.",
    imageUrl: "/images/historical/colonizadores.jpg",
    alt: "Primeiros colonizadores chegando a Terra Nova do Norte",
  },
  {
    id: 2,
    title: "Construção da primeira igreja (1980)",
    description:
      "Moradores se reuniram para erguer a primeira igreja da comunidade.",
    imageUrl: "/images/historical/igreja.jpg",
    alt: "Construção da primeira igreja de Terra Nova do Norte",
  },
  {
    id: 3,
    title: "Inauguração da Prefeitura (1986)",
    description:
      "Cerimônia de inauguração do prédio da prefeitura após emancipação do município.",
    imageUrl: "/images/historical/prefeitura.jpg",
    alt: "Inauguração da prefeitura de Terra Nova do Norte",
  },
  {
    id: 4,
    title: "Primeira Festa do Colono (1988)",
    description:
      "Celebração que se tornaria uma das principais festividades anuais do município.",
    imageUrl: "/images/historical/festa-colono.jpg",
    alt: "Primeira Festa do Colono em Terra Nova do Norte",
  },
  {
    id: 5,
    title: "Vista aérea (1990)",
    description:
      "Imagem aérea mostrando o desenvolvimento urbano inicial da cidade.",
    imageUrl: "/images/historical/vista-aerea.jpg",
    alt: "Vista aérea de Terra Nova do Norte em 1990",
  },
];

export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-brand-blue mb-4 text-center">
          Terra Nova do Norte
        </h1>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-8">
          Conheça a história, natureza e cultura desta cidade encantadora no
          coração de Mato Grosso
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card Localidade */}
          <ScrollReveal
            preset="fade"
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-6 border border-gray-100"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-brand-blue/10 rounded-lg">
                <MapPin className="w-6 h-6 text-brand-blue" />
              </div>
              <h2 className="text-2xl font-semibold text-brand-blue ml-3">
                Localidade
              </h2>
            </div>
            <div className="space-y-4 text-gray-600">
              <p>
                Terra Nova do Norte está situada na região centro-norte do
                estado de Mato Grosso, a aproximadamente 627 km da capital,
                Cuiabá.
              </p>
              <p>
                O município faz parte da Região Geográfica Intermediária de
                Sinop e da Região Imediata de Sinop.
              </p>
              <p>
                Com uma área de 2.399,736 km², limita-se com os municípios de
                Colíder, Peixoto de Azevedo, Nova Guarita e Nova Santa Helena.
              </p>
              <p>
                A sede municipal está a uma altitude média de 304 metros acima
                do nível do mar.
              </p>
              <div className="flex items-center text-sm text-brand-blue mt-4">
                <ExternalLink className="w-4 h-4 mr-1" />
                <a
                  href="https://pt.wikipedia.org/wiki/Terra_Nova_do_Norte"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-orange transition-colors"
                >
                  Saiba mais na Wikipedia
                </a>
              </div>
            </div>
          </ScrollReveal>

          {/* Card Histórico */}
          <ScrollReveal
            delay={200}
            preset="slide"
            direction="down"
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-6 border border-gray-100 lg:col-span-2"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-brand-orange/10 rounded-lg">
                <History className="w-6 h-6 text-brand-orange" />
              </div>
              <h2 className="text-2xl font-semibold text-brand-blue ml-3">
                Histórico
              </h2>
            </div>
            <div className="space-y-4 text-gray-600">
              <p>
                A origem de Terra Nova do Norte remonta ao final da década de
                1970, quando mais de mil famílias de posseiros foram desalojadas
                de suas terras no Rio Grande do Sul, especialmente das cidades
                de Nonoai, Planalto, Tenente Portela, Miraguaí e Guarita, devido
                a conflitos com indígenas da etnia Kaingang.
              </p>
              <p>
                Sem áreas disponíveis para reassentamento no estado de origem,
                essas famílias foram direcionadas ao norte de Mato Grosso.
              </p>
              <p>
                O governo federal destinou 435 mil hectares para a formação de
                assentamentos, e a Cooperativa Agrária de Canarana foi
                responsável por estabelecer 1.062 lotes distribuídos em 9
                agrovilas.
              </p>
              <div className="flex items-center text-sm text-brand-blue mt-4">
                <ExternalLink className="w-4 h-4 mr-1" />
                <a
                  href="https://pt.wikipedia.org/wiki/Terra_Nova_do_Norte"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-orange transition-colors"
                >
                  Saiba mais na Wikipedia
                </a>
              </div>
            </div>
          </ScrollReveal>

          {/* Carrossel de Fotos Históricas */}
          <ScrollReveal
            delay={100}
            preset="fade"
            className="col-span-1 md:col-span-2 lg:col-span-3"
          >
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-6 border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-brand-blue/10 rounded-lg">
                  <History className="w-6 h-6 text-brand-blue" />
                </div>
                <h2 className="text-2xl font-semibold text-brand-blue ml-3">
                  Memórias Fotográficas
                </h2>
              </div>
              <HistoricalCarousel
                photos={historicalPhotos}
                className="rounded-lg overflow-hidden"
              />
            </div>
          </ScrollReveal>

          {/* Card Atrativos Naturais */}
          <ScrollReveal
            delay={400}
            preset="zoom"
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-6 border border-gray-100"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Leaf className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-semibold text-brand-blue ml-3">
                Atrativos Naturais
              </h2>
            </div>
            <div className="space-y-4 text-gray-600">
              <p>
                O município possui o Parque Ecológico, que oferece trilhas para
                caminhadas e áreas para piquenique, sendo um local ideal para
                apreciar a flora e fauna regionais.
              </p>
              <p>
                Além disso, o Museu Municipal abriga exposições sobre a história
                e cultura de Terra Nova do Norte, proporcionando um passeio
                educativo para os visitantes.
              </p>
              <div className="flex items-center text-sm text-brand-blue mt-4">
                <ExternalLink className="w-4 h-4 mr-1" />
                <a
                  href="https://passagemdeonibus.com/pontos-turisticos/terra-nova-do-norte-mt/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-orange transition-colors"
                >
                  Saiba mais
                </a>
              </div>
            </div>
          </ScrollReveal>

          {/* Card Fauna */}
          <ScrollReveal
            delay={600}
            preset="slide"
            direction="left"
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-6 border border-gray-100"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Bird className="w-6 h-6 text-yellow-600" />
              </div>
              <h2 className="text-2xl font-semibold text-brand-blue ml-3">
                Fauna
              </h2>
            </div>
            <div className="space-y-4 text-gray-600">
              <p>
                Situado no bioma Amazônia, Terra Nova do Norte abriga uma rica
                biodiversidade.
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="space-y-1">
                  <p>• Capivaras</p>
                  <p>• Antas</p>
                  <p>• Macacos</p>
                  <p>• Pacas</p>
                  <p>• Onças</p>
                  <p>• Jaguatiricas</p>
                  <p>• Tatus</p>
                  <p>• Cutias</p>
                </div>
                <div className="space-y-1">
                  <p>• Tamanduás</p>
                  <p>• Lontras</p>
                  <p>• Quatis</p>
                  <p>• Marrecos</p>
                  <p>• Gaviões</p>
                  <p>• Curiós</p>
                  <p>• Araras</p>
                  <p>• Papagaios</p>
                </div>
              </div>
              <div className="flex items-center text-sm text-brand-blue mt-4">
                <ExternalLink className="w-4 h-4 mr-1" />
                <a
                  href="https://pt.wikipedia.org/wiki/Terra_Nova_do_Norte"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-orange transition-colors"
                >
                  Saiba mais na Wikipedia
                </a>
              </div>
            </div>
          </ScrollReveal>

          {/* Card Flora */}
          <ScrollReveal
            delay={800}
            preset="slide"
            direction="right"
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-6 border border-gray-100"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-emerald-100 rounded-lg">
                <Trees className="w-6 h-6 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-semibold text-brand-blue ml-3">
                Flora
              </h2>
            </div>
            <div className="space-y-4 text-gray-600">
              <p>
                A vegetação predominante é a floresta amazônica, com árvores
                centenárias que coexistem com atividades agrícolas, pecuárias e
                fruticultoras.
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="space-y-1">
                  <p>• Ipê</p>
                  <p>• Jatobá</p>
                  <p>• Castanheira</p>
                  <p>• Buriti</p>
                  <p>• Açaí</p>
                  <p>• Tucum</p>
                  <p>• Jenipapo</p>
                  <p>• Pequi</p>
                </div>
                <div className="space-y-1">
                  <p>• Guariroba</p>
                  <p>• Manga</p>
                  <p>• Caju</p>
                  <p>• Mamão</p>
                  <p>• Abacaxi</p>
                  <p>• Banana</p>
                  <p>• Maracujá</p>
                  <p>• Limão</p>
                </div>
              </div>
              <div className="flex items-center text-sm text-brand-blue mt-4">
                <ExternalLink className="w-4 h-4 mr-1" />
                <a
                  href="https://pt.wikipedia.org/wiki/Terra_Nova_do_Norte"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-orange transition-colors"
                >
                  Saiba mais na Wikipedia
                </a>
              </div>
            </div>
          </ScrollReveal>

          {/* Card Tipos Humanos */}
          <ScrollReveal
            delay={1000}
            preset="fade"
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-6 border border-gray-100"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-2xl font-semibold text-brand-blue ml-3">
                Tipos Humanos
              </h2>
            </div>
            <div className="space-y-4 text-gray-600">
              <p>
                A população de Terra Nova do Norte é composta majoritariamente
                por descendentes de migrantes do sul do Brasil, especialmente do
                Rio Grande do Sul.
              </p>
              <p>
                A economia local é baseada na agricultura familiar, pecuária e,
                em menor escala, na extração de madeira e mineração.
              </p>
              <p>
                A presença de comunidades indígenas na região também contribui
                para a diversidade cultural do município.
              </p>
              <div className="flex items-center text-sm text-brand-blue mt-4">
                <ExternalLink className="w-4 h-4 mr-1" />
                <a
                  href="https://portal.unemat.br/media/files/PPGGEO/Projeto%20Ana%20Claudia.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-orange transition-colors"
                >
                  Saiba mais
                </a>
              </div>
            </div>
          </ScrollReveal>

          {/* Card Curiosidades */}
          <ScrollReveal
            delay={1200}
            preset="zoom"
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-6 border border-gray-100 lg:col-span-2"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-pink-100 rounded-lg">
                <Info className="w-6 h-6 text-pink-600" />
              </div>
              <h2 className="text-2xl font-semibold text-brand-blue ml-3">
                Curiosidades
              </h2>
            </div>
            <div className="space-y-4 text-gray-600">
              <div className="grid gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p>
                    O nome &quot;Terra Nova do Norte&quot; foi escolhido para
                    distinguir o município de outras localidades homônimas nos
                    estados de Pernambuco e Bahia.
                  </p>
                  <div className="flex items-center text-sm text-brand-blue mt-2">
                    <ExternalLink className="w-4 h-4 mr-1" />
                    <a
                      href="https://www.terranovadonorte.mt.leg.br/institucional/historia"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-brand-orange transition-colors"
                    >
                      Fonte: Câmara Municipal
                    </a>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p>
                    O município possui uma forte tradição na agricultura
                    familiar, sendo esta uma das principais atividades
                    econômicas e culturais da região.
                  </p>
                  <div className="flex items-center text-sm text-brand-blue mt-2">
                    <ExternalLink className="w-4 h-4 mr-1" />
                    <a
                      href="https://portal.unemat.br/media/files/PPGGEO/Projeto%20Ana%20Claudia.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-brand-orange transition-colors"
                    >
                      Fonte: Portal Unemat
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </main>
  );
}
  