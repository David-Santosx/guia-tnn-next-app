"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, Calendar, MapPin, User, Tag } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Photo {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  photographer: string;
  category: string;
  imageUrl: string;
}

interface PhotoModalProps {
  photo: Photo | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function PhotoModal({
  photo,
  isOpen,
  onClose,
}: PhotoModalProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  // Handle escape key press to close modal
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

  // Handle closing with animation
  const handleClose = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
      onClose();
    }, 300);
  };

  if (!isOpen || !photo) return null;

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "Data não informada";
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return "Data inválida";
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 transition-opacity duration-300 ${
        isAnimating ? "opacity-0" : "opacity-100"
      }`}
      onClick={handleClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Modal Content */}
      <div
        className="relative bg-white rounded-lg overflow-hidden max-w-5xl w-full max-h-[90vh] shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 z-10 bg-gray-200/80 hover:bg-gray-300/90 text-gray-700 rounded-full p-2 transition-colors"
          onClick={handleClose}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Image Container */}
        <div className="relative w-full h-[50vh] md:h-[65vh]">
          <Image
            src={photo.imageUrl}
            alt={photo.title}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 90vw"
            priority
          />
        </div>

        {/* Details Container */}
        <div className="w-full p-6 bg-white text-gray-800">
          <h2 className="text-xl md:text-2xl font-bold mb-3 text-gray-900">
            {photo.title}
          </h2>

          <p className="text-gray-600 mb-4">{photo.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-brand-orange" />
              <span className="text-gray-600">
                Categoria:{" "}
                <span className="text-gray-800 font-medium">
                  {photo.category}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-orange" />
              <span className="text-gray-600">
                Data:{" "}
                <span className="text-gray-800 font-medium">
                  {formatDate(photo.date)}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-orange" />
              <span className="text-gray-600">
                Local:{" "}
                <span className="text-gray-800 font-medium">
                  {photo.location}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-brand-orange" />
              <span className="text-gray-600">
                Fotógrafo:{" "}
                <span className="text-gray-800 font-medium">
                  {photo.photographer}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}