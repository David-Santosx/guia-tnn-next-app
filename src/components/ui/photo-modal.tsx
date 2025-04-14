"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, Calendar, MapPin, User, Tag } from "lucide-react";

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

export default function PhotoModal({ photo, isOpen, onClose }: PhotoModalProps) {
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
        className="relative bg-white rounded-xl overflow-hidden max-w-5xl w-full max-h-[90vh] shadow-2xl flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          className="absolute top-3 right-3 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-colors"
          onClick={handleClose}
        >
          <X className="w-6 h-6" />
        </button>
        
        {/* Image Container */}
        <div className="relative w-full md:w-2/3 h-[300px] md:h-auto">
          <Image
            src={photo.imageUrl}
            alt={photo.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 66vw"
            priority
          />
        </div>
        
        {/* Details Container */}
        <div className="w-full md:w-1/3 p-6 overflow-y-auto">
          <div className="flex items-center mb-3">
            <Tag className="w-5 h-5 text-brand-orange mr-2" />
            <span className="text-sm font-medium text-brand-orange">{photo.category}</span>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-3">{photo.title}</h2>
          
          <p className="text-gray-700 mb-6">{photo.description}</p>
          
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-gray-500" />
              <span>Data: {photo.date}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-gray-500" />
              <span>Local: {photo.location}</span>
            </div>
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2 text-gray-500" />
              <span>Fotógrafo: {photo.photographer}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}