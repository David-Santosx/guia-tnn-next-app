'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HistoricalPhoto {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  alt: string;
}

interface HistoricalCarouselProps {
  photos: HistoricalPhoto[];
  autoPlayInterval?: number;
  className?: string;
}

export default function HistoricalCarousel({
  photos,
  autoPlayInterval = 5000,
  className = '',
}: HistoricalCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % photos.length);
  }, [photos.length]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + photos.length) % photos.length);
  }, [photos.length]);

  // Configurar autoplay
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(goToNext, autoPlayInterval);
    return () => clearInterval(interval);
  }, [isAutoPlaying, goToNext, autoPlayInterval]);

  // Pausar autoplay quando o usuário interagir com o carrossel
  const handleInteraction = () => {
    setIsAutoPlaying(false);
    
    // Retomar autoplay após 10 segundos de inatividade
    const timeout = setTimeout(() => setIsAutoPlaying(true), 10000);
    return () => clearTimeout(timeout);
  };

  if (!photos || photos.length === 0) {
    return null;
  }

  return (
    <div 
      className={`relative overflow-hidden rounded-xl shadow-lg ${className}`}
      onMouseEnter={handleInteraction}
      onTouchStart={handleInteraction}
    >
      <div className="relative aspect-[16/9] w-full">
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <Image
              src={photo.imageUrl}
              alt={photo.alt}
              fill
              className="object-cover"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white">
              <h3 className="text-xl md:text-2xl font-semibold mb-2">{photo.title}</h3>
              <p className="text-sm md:text-base text-gray-200">{photo.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Controles de navegação */}
      <button
        onClick={(e) => {
          e.preventDefault();
          goToPrevious();
          handleInteraction();
        }}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-1.5 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
        aria-label="Foto anterior"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={(e) => {
          e.preventDefault();
          goToNext();
          handleInteraction();
        }}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-1.5 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
        aria-label="Próxima foto"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Indicadores */}
      <div className="absolute bottom-0 left-0 right-0 z-20 flex justify-center gap-1.5 pb-2">
        {photos.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index);
              handleInteraction();
            }}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex
                ? 'bg-white w-4'
                : 'bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Ir para foto ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}