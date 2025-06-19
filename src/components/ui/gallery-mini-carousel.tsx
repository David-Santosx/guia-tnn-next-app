import Image from "next/image";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface GalleryImage {
  id: string;
  title: string;
  imageUrl: string;
  description?: string;
}

interface GalleryMiniCarouselProps {
  autoRotateInterval?: number;
}

export default function GalleryMiniCarousel({ autoRotateInterval = 5000 }: GalleryMiniCarouselProps) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('/api/galeria');
        if (!response.ok) throw new Error('Falha ao carregar imagens');
        const data = await response.json();
        
        // Garante que temos pelo menos algumas imagens
        if (data.length === 0) throw new Error('Nenhuma imagem encontrada');
        
        setImages(data.slice(0, 5)); // Limita a 5 imagens
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar imagens');
        console.error('Erro ao carregar imagens:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, []);

  useEffect(() => {
    if (images.length === 0) return;

    const interval = setInterval(() => {
      handleNextSlide();
    }, autoRotateInterval);

    return () => clearInterval(interval);
  }, [images.length, autoRotateInterval, currentIndex]);

  const handleNextSlide = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentIndex((current) => (current + 1) % images.length);
    
    // Reset transition state
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  };

  const handlePrevSlide = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentIndex((current) => (current - 1 + images.length) % images.length);
    
    // Reset transition state
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  };

  if (isLoading) {
    return (
      <div className="w-full h-64 bg-gray-200 animate-pulse rounded-lg">
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-brand-blue border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error || images.length === 0) {
    return (
      <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Não foi possível carregar as imagens</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-64 rounded-lg overflow-hidden group">
      {/* Overlay de fundo */}
      <div className="absolute inset-0 bg-black/20 z-10 transition-opacity opacity-0 group-hover:opacity-100"></div>
      
      {/* Container das imagens */}
      <div className="relative w-full h-full">
        {images.map((image, index) => (
          <div
            key={image.id}
            className={`absolute inset-0 transition-all duration-500 ease-in-out ${
              index === currentIndex 
                ? "opacity-100 transform scale-100" 
                : "opacity-0 transform scale-105"
            }`}
          >
            <Image
              src={image.imageUrl}
              alt={image.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      {/* Controles de navegação */}
      <button
        onClick={handlePrevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white disabled:opacity-50"
        disabled={isTransitioning}
      >
        <ChevronLeft className="w-5 h-5 text-gray-800" />
      </button>

      <button
        onClick={handleNextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white disabled:opacity-50"
        disabled={isTransitioning}
      >
        <ChevronRight className="w-5 h-5 text-gray-800" />
      </button>

      {/* Informações da imagem */}
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-4 z-10">
        <h3 className="text-white text-lg font-medium">
          {images[currentIndex].title}
        </h3>
        {images[currentIndex].description && (
          <p className="text-white/90 text-sm line-clamp-2">
            {images[currentIndex].description}
          </p>
        )}
      </div>

      {/* Indicadores de slides */}
      <div className="absolute bottom-4 right-4 z-20 flex gap-1">
        {images.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? "bg-white w-4" 
                : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}