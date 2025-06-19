"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon, StarIcon } from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  description: string;
  avatar: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Mikael Natann",
    role: "Nascido e criado em Terra Nova do Norte",
    description: "Nasci e cresci aqui, acompanhando a evolução de nossa cidade ao longo das gestões. Terra Nova já foi um lugar onde muita gente não gostaria de estar. Hoje a conversa é diferente: com mais investimentos, infraestrutura, asfalto, hospital quase pronto, estamos entre as melhores do MT. Não temos do que reclamar.",
    avatar: "https://instagram.fops5-1.fna.fbcdn.net/v/t51.2885-19/419044914_2001557476894259_2819750921138841739_n.jpg?stp=dst-jpg_s150x150_tt6&_nc_ht=instagram.fops5-1.fna.fbcdn.net&_nc_cat=111&_nc_oc=Q6cZ2QFP1bfPZdQEpwaVynVhDk1R9_2R2NLuVfweVTfPDLgcdkfOaAHQye1O1ViNkP6JsOE&_nc_ohc=nmmUDggH9lkQ7kNvwGzT5G6&_nc_gid=lwLxW5YZGxUjp310ALf9eA&edm=APoiHPcBAAAA&ccb=7-5&oh=00_AfMKiUSPgiNKKqW_KDkA0P30ud198vrHn6p3Tgfa30miYg&oe=68588312&_nc_sid=22de04",
    rating: 5,
  },
  {
    id: 2,
    name: "João Oliveira",
    role: "Dono de Mercado Local",
    description: "Como comerciante local, vejo o potencial de crescimento da nossa cidade. O turismo tem aumentado e isso traz novas oportunidades para todos.",
    avatar: "https://avatar.iran.liara.run/public/45",
    rating: 4,
  },
  {
    id: 3,
    name: "Ana Souza",
    role: "Pioneira da Cidade",
    description: "Nasci aqui e mesmo após estudar fora, decidi voltar. Terra Nova do Norte tem evoluído muito nos últimos anos, mantendo sua essência acolhedora.",
    avatar: "https://avatar.iran.liara.run/public/66",
    rating: 5,
  },
];

export default function TestimonialCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setActiveIndex((current) => (current + 1) % testimonials.length);
  }, []);

  const prevSlide = useCallback(() => {
    setActiveIndex((current) => 
      current === 0 ? testimonials.length - 1 : current - 1
    );
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [nextSlide]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <StarIcon
        key={index}
        className={`w-5 h-5 ${
          index < rating ? "text-brand-orange fill-brand-orange" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Carousel container */}
      <div className="overflow-hidden relative rounded-xl bg-white shadow-lg">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id} 
              className="w-full flex-shrink-0 p-8 md:p-12"
            >
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-brand-blue/20 flex-shrink-0">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                
                <div className="flex flex-col items-center md:items-start">
                  <div className="flex mb-2">{renderStars(testimonial.rating)}</div>
                  <h3 className="text-xl font-bold text-brand-blue mb-1">{testimonial.name}</h3>
                  <span className="text-sm text-brand-orange font-medium mb-3">{testimonial.role}</span>
                  <p className="text-gray-600 text-center md:text-left">{testimonial.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation buttons */}
      <button 
        onClick={prevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-brand-blue rounded-full p-2 shadow-md backdrop-blur-sm z-10 transition-all"
        aria-label="Anterior"
      >
        <ChevronLeftIcon className="w-6 h-6" />
      </button>
      
      <button 
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-brand-blue rounded-full p-2 shadow-md backdrop-blur-sm z-10 transition-all"
        aria-label="Próximo"
      >
        <ChevronRightIcon className="w-6 h-6" />
      </button>

      {/* Indicators */}
      <div className="flex justify-center mt-4 gap-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              activeIndex === index 
                ? "bg-brand-orange w-6" 
                : "bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}