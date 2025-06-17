'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useEffect, useState } from "react";
import { Info } from "lucide-react";

interface AdvertisementProps {
  src: string | string[];
  alt: string | string[];
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  containerClassName?: string;
  href?: string | string[];
  position?: "fixed" | "relative" | "absolute";
  onClick?: () => void;
  imageType?: "gif" | "jpg" | "jpeg" | "png";
  isActive?: boolean;
  startDate?: Date;
  endDate?: Date;
  id?: string | string[];
}

export function Advertisement({
  src,
  alt,
  width = 300,
  height = 250,
  priority = false,
  className,
  containerClassName,
  href,
  position = "relative",
  onClick,
  isActive = true,
  startDate,
  endDate,
  id,
}: AdvertisementProps) {
  // Estado para controlar qual anúncio está sendo exibido
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isValid, setIsValid] = useState(true);

  // Converter entradas únicas em arrays para tratamento uniforme
  const sources = Array.isArray(src) ? src : [src];
  const alts = Array.isArray(alt) ? alt : Array(sources.length).fill(alt);
  const hrefs = Array.isArray(href) ? href : Array(sources.length).fill(href);
  const ids = Array.isArray(id) ? id : Array(sources.length).fill(id);

  // Verificar se o anúncio está dentro do período de validade
  useEffect(() => {
    if (startDate || endDate) {
      const now = new Date();
      if (startDate && now < startDate) {
        setIsValid(false);
        return;
      }
      if (endDate && now > endDate) {
        setIsValid(false);
        return;
      }
    }
    setIsValid(true);
  }, [startDate, endDate]);

  // Configurar rotação de anúncios se houver mais de um
  useEffect(() => {
    if (sources.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % sources.length);
    }, 8000); // Alternar a cada 8 segundos

    return () => clearInterval(interval);
  }, [sources.length]);

  // Se não estiver ativo ou não for válido, não renderizar nada
  if (!isActive || !isValid || sources.length === 0 || !sources[0]) return null;

  const currentSrc = sources[currentIndex];
  const currentAlt = alts[currentIndex];
  const currentHref = hrefs[currentIndex];
  const currentId = ids[currentIndex];

  const imageComponent = (
    <div
      className={cn(
        "overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 relative",
        position === "fixed" && "fixed z-50",
        containerClassName
      )}
      data-ad-id={currentId}
    >
      {/* Indicador de publicidade */}
      <div className="absolute top-0 left-0 bg-black/40 text-white text-[6px] px-2 py-1 z-50 rounded-br-md flex flex-col items-center justify-center group">
        <Info className="w-3 h-3" />
        <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute left-full ml-2 bg-black text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap pointer-events-none">
          Publicidade
        </span>
      </div>

      <Image
        src={currentSrc}
        alt={currentAlt}
        width={width}
        height={height}
        priority={priority}
        className={cn(
          "w-full h-full object-cover transition-transform duration-300",
          className
        )}
        onClick={onClick}
      />
    </div>
  );

  if (currentHref) {
    return (
      <a
        href={currentHref}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
        data-ad-id={currentId}
      >
        {imageComponent}
      </a>
    );
  }

  return imageComponent;
}