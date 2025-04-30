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
  return (
    <>
      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/brand/thumbnail.jpg"
            alt="Terra Nova do Norte"
            fill
            quality={100}
            sizes="100vw"
            className="object-cover brightness-70"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-blue/50 to-black/70"></div>

          <div className="absolute bottom-2 right-2 text-[9px] text-white/80 bg-black/30 px-2 py-1 rounded backdrop-blur-sm z-10">
            Imagem: Google Maps
          </div>
        </div>

        {/* Centered Content Container */}
        <div className="container mx-auto px-6 md:px-12 z-10 relative text-center">
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
              className="bg-brand-orange text-white font-medium py-3 px-6 rounded-md shadow-md flex items-center justify-center item-hover"
            >
              <MegaphoneIcon className="w-5 h-5 mr-2" />
              Próximos eventos
            </Link>
            <Link
              href="/galeria"
              className="bg-brand-blue text-white font-medium py-3 px-6 rounded-md shadow-md flex items-center justify-center item-hover"
            >
              <ImagesIcon className="w-5 h-5 mr-2" />
              Galeria de fotos
            </Link>
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

  // Função para obter anúncio por posição
  const getAnuncioByPosition = (position: number) => {
    return anuncios.find((ad) => ad.position === position);
  };

  // Função para gerar URL de placeholder
  const getPlaceholderUrl = (width: number, height: number) => {
    return `https://fakeimg.pl/${width}x${height}?text=ANUNCIE+AQUI`;
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
                <Advertisement
                  src={
                    getAnuncioByPosition(1)?.imageUrl || getPlaceholderUrl(250, 600)
                  }
                  alt={getAnuncioByPosition(1)?.title || "Anuncie aqui"}
                  width={250}
                  height={600}
                  href="#"
                  isActive={getAnuncioByPosition(1)?.isActive ?? true}
                  id="anuncio-lateral-esquerdo"
                />
              )}
            </div>

            {/* Conteúdo Principal */}
            <div className="flex-1 max-w-4xl mx-auto px-0 md:px-6">
              <h2 className="text-3xl font-bold text-brand-blue text-center mb-8">
                Um pouco mais sobre nosso município
              </h2>

              <p className="text-gray-700 text-center mb-12 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
                in dui mauris. Vivamus hendrerit arcu sed erat molestie
                vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh
                porttitor. Ut in nulla enim. Phasellus molestie magna non est
                bibendum non venenatis nisl tempor. Suspendisse dictum feugiat
                nisl ut dapibus.
              </p>

              <div className="flex flex-col md:flex-row gap-8 justify-center items-center mb-12">
                <div className="relative w-full md:w-2/5 h-64 md:h-80 transform rotate-[-3deg] transition-all duration-500 hover:rotate-0 hover:scale-105 group">
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

                <div className="relative w-full md:w-2/5 h-64 md:h-80 transform rotate-[3deg] transition-all duration-500 hover:rotate-0 hover:scale-105 group">
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

              <p className="text-gray-700 text-center leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a
                diam lectus. Sed sit amet ipsum mauris. Maecenas congue ligula
                ac quam viverra nec consectetur ante hendrerit. Donec et mollis
                dolor. Praesent et diam eget libero egestas mattis sit amet
                vitae augue. Nam tincidunt congue enim, ut porta lorem lacinia
                consectetur.
              </p>
            </div>

            {/* Anúncio Direito - Visível apenas em telas grandes */}
            <div className="hidden xl:block w-[250px] h-[600px] flex-shrink-0 sticky top-24">
              {anunciosLoading ? (
                <div className="w-[250px] h-[600px] bg-gray-200 animate-pulse rounded-lg"></div>
              ) : (
                <Advertisement
                  src={
                    getAnuncioByPosition(2)?.imageUrl || getPlaceholderUrl(250, 600)
                  }
                  alt={getAnuncioByPosition(2)?.title || "Anuncie aqui"}
                  width={250}
                  height={600}
                  href="#"
                  isActive={getAnuncioByPosition(2)?.isActive ?? true}
                  id="anuncio-lateral-direito"
                />
              )}
            </div>
          </div>
        </div>
      </section>
    );
  };

  const TestimonialsSection = () => {
    return (
      <section className="py-16 bg-gradient-to-b from-white to-gray-100">
        <div className="container mx-auto px-6 md:px-12">
          <h2 className="text-3xl font-bold text-brand-blue text-center mb-4">
            Qual a opinião dos moradores?
          </h2>

          <p className="text-gray-600 max-w-2xl mx-auto text-center mb-12">
            Convidamos alguns moradores para compartilhar suas experiências e
            impressões sobre Terra Nova do Norte. Confira o que eles têm a dizer
            sobre nossa cidade.
          </p>

          <TestimonialCarousel />
        </div>
      </section>
    );
  };

  const EventsSection = () => {
    if (eventsLoading)
      return <div className="py-16 text-center">Carregando eventos...</div>;
    if (eventsError)
      return (
        <div className="py-16 text-center text-red-500">{eventsError}</div>
      );

    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 md:px-12">
          <h2 className="text-3xl font-bold text-brand-blue text-center mb-4">
            Próximos Eventos
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-center mb-12">
            Confira os eventos que estão acontecendo em Terra Nova do Norte.
            Venha participar e vivenciar momentos especiais em nossa cidade!
          </p>
          <EventsCarousel events={events} autoRotateInterval={3000} />
          <div className="text-center mt-12 lg:mt-2">
            <Link
              href="/eventos"
              className="bg-brand-orange text-white font-medium py-3 px-6 rounded-md shadow-md inline-flex items-center justify-center item-hover"
            >
              <MegaphoneIcon className="w-5 h-5 mr-2" />
              Ver todos os eventos
            </Link>
          </div>
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
            <Advertisement
              src={getAnuncioByPosition(0)?.imageUrl || getPlaceholderUrl(728, 90)}
              alt={getAnuncioByPosition(0)?.title || "Anuncie aqui"}
              width={728}
              height={90}
              href="#"
              isActive={getAnuncioByPosition(0)?.isActive ?? true}
              id="anuncio-topo"
            />
          )}
        </div>
      </div>
      <AboutSection />
      <TestimonialsSection />
      <EventsSection />
    </main>
  );
}
