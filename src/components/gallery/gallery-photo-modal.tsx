"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, Calendar, MapPin, User, Tag } from "lucide-react";
import { GalleryPhoto } from "./photo-fetcher";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface GalleryPhotoModalProps {
  photo: GalleryPhoto | null;
  isOpen: boolean;
  onClose: () => void;
}

export function GalleryPhotoModal({ photo, isOpen, onClose }: GalleryPhotoModalProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
      onClose();
    }, 300);
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return null;
    try {
      return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch {
      return null;
    }
  };

  if (!isOpen || !photo) return null;

  const formattedDate = photo.date ? formatDate(photo.date) : null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 transition-opacity duration-300 ${
        isAnimating ? "opacity-0" : "opacity-100"
      }`}
      onClick={handleClose}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
      
      <div 
        className="relative bg-gray-900 rounded-lg overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={handleClose}
          className="absolute top-2 right-2 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
        >
          <X size={20} />
        </button>
        
        <div className="relative w-full h-[50vh] md:h-[60vh]">
          <Image
            src={photo.imageUrl}
            alt={photo.title}
            fill
            sizes="(max-width: 768px) 100vw, 80vw"
            className="object-contain"
            priority
          />
        </div>
        
        <div className="p-4 md:p-6 bg-gray-900 text-white">
          <h2 className="text-xl md:text-2xl font-bold mb-2">{photo.title}</h2>
          
          {photo.description && (
            <p className="text-gray-300 mb-4">{photo.description}</p>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            {photo.category && (
              <div className="flex items-center gap-2">
                <Tag size={16} className="text-brand-orange" />
                <span className="text-gray-300">Categoria: <span className="text-white">{photo.category}</span></span>
              </div>
            )}
            
            {photo.photographer && (
              <div className="flex items-center gap-2">
                <User size={16} className="text-brand-orange" />
                <span className="text-gray-300">Fotógrafo: <span className="text-white">{photo.photographer}</span></span>
              </div>
            )}
            
            {photo.location && (
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-brand-orange" />
                <span className="text-gray-300">Local: <span className="text-white">{photo.location}</span></span>
              </div>
            )}
            
            {formattedDate && (
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-brand-orange" />
                <span className="text-gray-300">Data: <span className="text-white">{formattedDate}</span></span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}