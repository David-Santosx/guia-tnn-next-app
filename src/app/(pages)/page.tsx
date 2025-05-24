"use client";
import Image from "next/image";
import Link from "next/link";
import { ImagesIcon, MegaphoneIcon } from "lucide-react";
import Typewriter from "@/components/ui/typewriter";
import TestimonialCarousel from "@/components/testimonial-carousel";
import EventsCarousel from "@/components/events-carousel";
import { useEffect, useState } from "react";
import { Advertisement } from "@/components/ui/advertisement";

const HeroSection = () => {
  const scrollToNextSection = () => {
    // Encontra a próxima seção após o hero
    const nextSection = document.querySelector('section:nth-of-type(2)');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/brand/thumbnail.jpg"
            alt="Terra Nova do Norte"
            fill
            quality={100}
            sizes="100vw"
            className="object-cover brightness-70 scale-105 animate-slow-zoom"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-blue/50 to-black/70"></div>

          <div className="absolute bottom-2 right-2 text-[9px] text-white/80 bg-black/30 px-2 py-1 rounded backdrop-blur-sm z-10">
            Imagem: Google Maps
          </div>
        </div>

        {/* Centered Content Container */}
        <div className="container mx-auto px-6 md:px-12 z-10 relative text-center">
          <div className="bg-black/30 backdrop-blur-sm p-6 md:p-8 rounded-xl max-w-3xl mx-auto border border-white/10">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              <Typewriter
                text="Conheça Terra Nova do Norte"
                speed={80}
                delay={500}
                highlightText="Terra Nova do Norte"
                highlightClassName="text-brand-orange relative inline-block after:content-[''] after:absolute after:w-full after:h-[6px] after:bg-brand-orange/30 after:bottom-0 after:left-0 after:rounded-full"
              />
            </h1>
            <p className="text-white/90 mb-8 leading-relaxed max-w-2xl mx-auto opacity-0 animate-[fadeIn_1s_ease-in-out_2.5s_forwards]">
              Este guia virtual fará você descobrir os encantos, tradições e
              belezas naturais que fazem de Terra Nova do Norte um lugar único no
              coração de Mato Grosso. Prepare-se para uma jornada inesquecível!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center opacity-0 animate-[fadeIn_1s_ease-in-out_3s_forwards]">
              <Link
                href="/eventos"
                className="bg-brand-orange text-white font-medium py-3 px-6 rounded-md shadow-md flex items-center justify-center hover:bg-brand-orange/90 hover:scale-105 transition-all duration-300"
              >
                <MegaphoneIcon className="w-5 h-5 mr-2" />
                Eventos e Festas
              </Link>
              <Link
                href="/galeria"
                className="bg-brand-blue text-white font-medium py-3 px-6 rounded-md shadow-md flex items-center justify-center hover:bg-brand-blue/90 hover:scale-105 transition-all duration-300"
              >
                <ImagesIcon className="w-5 h-5 mr-2" />
                Galeria de fotos
              </Link>
            </div>
          </div>
          
          <div className="absolute bottom-[-60px] left-0 right-0 flex justify-center animate-bounce">
            <div 
              onClick={scrollToNextSection}
              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <path d="M12 5v14M5 12l7 7 7-7"/>
              </svg>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

// Event interface and data can be moved to a separate file later if needed
interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  imageUrl: string;
}

interface Advertisement {
  id: string;
  title: string;
  imageUrl: string;
  position: number;
  isActive: boolean;
  startDate: string;
  endDate: string;
}

export default function Page() {
  const [anuncios, setAnuncios] = useState<Advertisement[]>([]);
  const [anunciosLoading, setAnunciosLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [eventsError, setEventsError] = useState<string | null>(null);

  useEffect(() => {
    // Buscar anúncios
    fetch("/api/anuncios")
      .then(async (res) => {
        if (!res.ok) throw new Error("Erro ao buscar anúncios");
        const data = await res.json();
        setAnuncios(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setAnunciosLoading(false));

    // Buscar eventos
    fetch("/api/eventos")
      .then(async (res) => {
        if (!res.ok) throw new Error("Erro ao buscar eventos");
        const data = await res.json();
        setEvents(data);
      })
      .catch((err) => setEventsError(err.message))
      .finally(() => setEventsLoading(false));
  }, []);

  // Função para obter anúncios por posição
  const getAnunciosByPosition = (position: number) => {
    // Filtra anúncios ativos pela posição
    const filteredAds = anuncios.filter((ad) => ad.position === position && ad.isActive);
    
    // Verifica se há anúncios e se estão dentro do período de validade
    if (filteredAds.length === 0) return null;
    
    // Filtra anúncios que estão dentro do período de validade
    const validAds = filteredAds.filter(ad => {
      const now = new Date();
      const startDate = ad.startDate ? new Date(ad.startDate) : null;
      const endDate = ad.endDate ? new Date(ad.endDate) : null;
      
      // Se não tiver datas definidas, é válido
      if (!startDate && !endDate) return true;
      
      // Verifica se está dentro do período
      if (startDate && now < startDate) return false;
      if (endDate && now > endDate) return false;
      
      return true;
    });
    
    return validAds.length > 0 ? validAds : null;
  };

  const AboutSection = () => {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-[1920px] mx-auto px-4 md:px-8">
          <div className="flex justify-between items-start gap-4 md:gap-8">
            {/* Anúncio Esquerdo - Visível apenas em telas grandes */}
            <div className="hidden xl:block w-[250px] h-[600px] flex-shrink-0 sticky top-24">
              {anunciosLoading ? (
                <div className="w-[250px] h-[600px] bg-gray-200 animate-pulse rounded-lg"></div>
              ) : (
                getAnunciosByPosition(1) && (
                  <Advertisement
                    src={getAnunciosByPosition(1)?.map(ad => ad.imageUrl) || []}
                    alt={getAnunciosByPosition(1)?.map(ad => ad.title) || []}
                    width={250}
                    height={600}
                    href="#"
                    startDate={getAnunciosByPosition(1)?.[0]?.startDate ? new Date(getAnunciosByPosition(1)![0].startDate) : undefined}
                    endDate={getAnunciosByPosition(1)?.[0]?.endDate ? new Date(getAnunciosByPosition(1)![0].endDate) : undefined}
                    isActive={true}
                    id="anuncio-lateral-esquerdo"
                  />
                )
              )}
            </div>

            {/* Conteúdo Principal */}
            <div className="flex-1 max-w-4xl mx-auto px-0 md:px-6">
              <h2 className="section-title pb-4">
                Um pouco mais sobre nosso município
              </h2>

              <p className="text-gray-700 text-center mb-12 leading-relaxed">
                Terra Nova do Norte, localizada no norte de Mato Grosso, é uma
                cidade que encanta por sua história de colonização sulista e
                pela exuberante natureza amazônica que a cerca. Fundada na
                década de 1970, a cidade preserva suas raízes culturais através
                de festas tradicionais, gastronomia típica e um povo acolhedor.
                Com uma economia baseada na agricultura familiar e pecuária, o
                município oferece qualidade de vida em meio a paisagens
                deslumbrantes.
              </p>

              <div className="flex flex-col md:flex-row gap-8 justify-center items-center mb-12">
                <div className="relative w-full md:w-2/5 h-64 md:h-80 transform rotate-[-3deg] transition-all duration-500 hover:rotate-0 hover:scale-105 group card-hover">
                  <div className="absolute inset-0 bg-brand-blue/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center">
                    <span className="text-white font-bold text-xl bg-brand-blue/70 px-4 py-2 rounded-lg">Natureza Exuberante</span>
                  </div>
                  <Image
                    src="/brand/about-image-1.jpg"
                    alt="Natureza em Terra Nova do Norte "
                    fill
                    className="object-cover rounded-lg shadow-xl"
                  />
                  <div className="absolute bottom-2 right-2 text-[9px] text-white/80 bg-black/30 px-2 py-1 rounded backdrop-blur-sm z-10 opacity-70 group-hover:opacity-100 transition-opacity">
                    Imagem: Google Maps
                  </div>
                </div>

                <div className="relative w-full md:w-2/5 h-64 md:h-80 transform rotate-[3deg] transition-all duration-500 hover:rotate-0 hover:scale-105 group card-hover">
                  <div className="absolute inset-0 bg-brand-orange/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center">
                    <span className="text-white font-bold text-xl bg-brand-orange/70 px-4 py-2 rounded-lg">Cidade Acolhedora</span>
                  </div>
                  <Image
                    src="/brand/about-image-2.jpg"
                    alt="Vista da cidade de Terra Nova do Norte"
                    fill
                    className="object-cover rounded-lg shadow-xl"
                  />
                  <div className="absolute bottom-2 right-2 text-[9px] text-white/80 bg-black/30 px-2 py-1 rounded backdrop-blur-sm z-10 opacity-70 group-hover:opacity-100 transition-opacity">
                    Imagem: Mario Friedlander via Pulsar Imagens
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl shadow-md mb-12">
                <h3 className="text-xl font-semibold text-brand-blue mb-4">Destaques da Cidade</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center text-brand-orange mb-2">
                      <MegaphoneIcon className="w-5 h-5 mr-2" />
                      <h4 className="font-medium">Eventos Culturais</h4>
                    </div>
                    <p className="text-sm text-gray-600">Festas tradicionais e eventos culturais durante todo o ano.</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center text-brand-blue mb-2">
                      <ImagesIcon className="w-5 h-5 mr-2" />
                      <h4 className="font-medium">Belezas Naturais</h4>
                    </div>
                    <p className="text-sm text-gray-600">Cachoeiras, rios e paisagens deslumbrantes para explorar.</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center text-green-600 mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                      </svg>
                      <h4 className="font-medium">Gastronomia</h4>
                    </div>
                    <p className="text-sm text-gray-600">Culinária típica com influências sulistas e regionais.</p>
                  </div>
                </div>
              </div>

              <p className="text-gray-700 text-center mb-8 leading-relaxed">
                Além de suas belezas naturais, como cachoeiras cristalinas e
                rios abundantes, Terra Nova do Norte se destaca por seu
                calendário de eventos durante todo o ano. A tradicional Festa do
                Colono, as competições esportivas e as feiras culturais
                movimentam a economia local e proporcionam momentos de lazer e
                integração para moradores e visitantes. Convidamos você a
                explorar nosso guia e descobrir tudo o que nossa cidade tem a
                oferecer!
              </p>
            </div>

            {/* Anúncio Direito - Visível apenas em telas grandes */}
            <div className="hidden xl:block w-[250px] h-[600px] flex-shrink-0 sticky top-24">
              {anunciosLoading ? (
                <div className="w-[250px] h-[600px] bg-gray-200 animate-pulse rounded-lg"></div>
              ) : (
                getAnunciosByPosition(2) && (
                  <Advertisement
                    src={getAnunciosByPosition(2)?.map(ad => ad.imageUrl) || []}
                    alt={getAnunciosByPosition(2)?.map(ad => ad.title) || []}
                    width={250}
                    height={600}
                    href="#"
                    startDate={getAnunciosByPosition(2)?.[0]?.startDate ? new Date(getAnunciosByPosition(2)![0].startDate) : undefined}
                    endDate={getAnunciosByPosition(2)?.[0]?.endDate ? new Date(getAnunciosByPosition(2)![0].endDate) : undefined}
                    isActive={true}
                    id="anuncio-lateral-direito"
                  />
                )
              )}
            </div>
          </div>
        </div>
      </section>
    );
  };

  const TestimonialsSection = () => {
    return (
      <section className="py-16 bg-gradient-to-b from-white to-gray-100 relative overflow-hidden">
        {/* Elementos decorativos */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-brand-orange/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-brand-blue/10 rounded-full translate-x-1/3 translate-y-1/3"></div>
        
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <h2 className="section-title pb-4">
            Qual a opinião dos moradores?
          </h2>

          <p className="text-gray-600 max-w-2xl mx-auto text-center mb-12">
            Convidamos alguns moradores para compartilhar suas experiências e
            impressões sobre Terra Nova do Norte. Confira o que eles têm a dizer
            sobre nossa cidade.
          </p>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <TestimonialCarousel />
          </div>
        </div>
      </section>
    );
  };

  const EventsSection = () => {
    if (eventsLoading)
      return (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6 md:px-12 text-center">
            <div className="flex flex-col items-center justify-center min-h-[300px]">
              <div className="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600">Carregando eventos...</p>
            </div>
          </div>
        </section>
      );
      
    if (eventsError)
      return (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6 md:px-12 text-center">
            <div className="bg-red-50 p-6 rounded-lg border border-red-200 inline-block">
              <p className="text-red-500">{eventsError}</p>
              <button className="mt-4 bg-brand-blue text-white px-4 py-2 rounded-md hover:bg-brand-blue/90 transition-colors">
                Tentar novamente
              </button>
            </div>
          </div>
        </section>
      );

    return (
      <section className="py-16 bg-white relative">
        <div className="absolute inset-0 bg-[url('/brand/pattern-bg.png')] opacity-5"></div>
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <h2 className="section-title pb-4">
            Eventos e Festas
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-center mb-12">
            Confira os eventos que estão acontecendo em Terra Nova do Norte.
            Venha participar e vivenciar momentos especiais em nossa cidade!
          </p>
          <EventsCarousel events={events} autoRotateInterval={3000} />
          
          <div className="text-center mt-8">
            <Link
              href="/eventos"
              className="bg-brand-orange text-white font-medium py-3 px-6 rounded-md shadow-md inline-flex items-center justify-center hover:bg-brand-orange/90 hover:scale-105 transition-all duration-300"
            >
              <MegaphoneIcon className="w-5 h-5 mr-2" />
              Ver todos os eventos
            </Link>
          </div>
        </div>
      </section>
    );
  };

  const CTASection = () => {
    return (
      <section className="py-16 bg-gradient-to-r from-brand-blue to-brand-blue/80 text-white">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Explore Terra Nova do Norte
          </h2>
          <p className="max-w-2xl mx-auto mb-8 text-white/90">
            Descubra tudo o que nossa cidade tem a oferecer. Comércios locais, eventos, 
            pontos turísticos e muito mais em um só lugar.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12">
            <Link href="/sobre" className="bg-white/10 backdrop-blur-sm p-4 rounded-lg hover:bg-white/20 transition-colors flex flex-col items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 16v-4M12 8h.01"/>
              </svg>
              <span>Sobre a Cidade</span>
            </Link>
            <Link href="/galeria" className="bg-white/10 backdrop-blur-sm p-4 rounded-lg hover:bg-white/20 transition-colors flex flex-col items-center">
              <ImagesIcon className="mb-2" />
              <span>Galeria de Fotos</span>
            </Link>
            <Link href="/eventos" className="bg-white/10 backdrop-blur-sm p-4 rounded-lg hover:bg-white/20 transition-colors flex flex-col items-center">
              <MegaphoneIcon className="mb-2" />
              <span>Eventos</span>
            </Link>
            <Link href="/comercios" className="bg-white/10 backdrop-blur-sm p-4 rounded-lg hover:bg-white/20 transition-colors flex flex-col items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2">
                <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"/>
                <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"/>
                <path d="M12 3v6"/>
              </svg>
              <span>Comércios</span>
            </Link>
          </div>
          
          <Link 
            href="/sobre-nos" 
            className="inline-flex items-center bg-white text-brand-blue px-6 py-3 rounded-lg font-medium hover:bg-white/90 transition-colors"
          >
            Conheça quem está por trás do Guia TNN
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </section>
    );
  };

  return (
    <main>
      <HeroSection />
      <div className="w-full bg-gray-100 py-8">
        <div className="max-w-[728px] mx-auto flex items-center justify-center">
          {anunciosLoading ? (
            <div className="w-[728px] h-[90px] bg-gray-200 animate-pulse rounded-lg"></div>
          ) : (
            getAnunciosByPosition(0) && (
              <Advertisement
                src={getAnunciosByPosition(0)?.map(ad => ad.imageUrl) || []}
                alt={getAnunciosByPosition(0)?.map(ad => ad.title) || []}
                width={728}
                height={90}
                href="#"
                startDate={getAnunciosByPosition(0)?.[0]?.startDate ? new Date(getAnunciosByPosition(0)![0].startDate) : undefined}
                endDate={getAnunciosByPosition(0)?.[0]?.endDate ? new Date(getAnunciosByPosition(0)![0].endDate) : undefined}
                isActive={true}
                id="anuncio-topo"
              />
            )
          )}
        </div>
      </div>
      <AboutSection />
      <TestimonialsSection />
      <EventsSection />
      <CTASection />
    </main>
  );
};
