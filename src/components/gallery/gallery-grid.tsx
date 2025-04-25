"use client";

import { useState } from "react";
import Image from "next/image";
import { GalleryPhoto } from "./photo-fetcher";
import { GalleryPhotoModal } from "./gallery-photo-modal";
import { Tag } from "lucide-react";

interface GalleryGridProps {
  photos: GalleryPhoto[];
}

export function GalleryGrid({ photos }: GalleryGridProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openPhotoModal = (photo: GalleryPhoto) => {
    setSelectedPhoto(photo);
    setIsModalOpen(true);
  };

  const closePhotoModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedPhoto(null), 300);
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {photos.map((photo) => (
          <div 
            key={photo.id}
            className="group relative aspect-square overflow-hidden rounded-lg cursor-pointer transition-transform duration-300 hover:scale-[1.02] shadow-md hover:shadow-xl"
            onClick={() => openPhotoModal(photo)}
          >
            <Image
              src={photo.imageUrl}
              alt={photo.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
              <h3 className="text-white font-medium text-lg mb-1 line-clamp-2">{photo.title}</h3>
              
              {photo.category && (
                <div className="flex items-center gap-1.5 mt-1">
                  <Tag size={14} className="text-brand-orange" />
                  <span className="text-white/90 text-sm">{photo.category}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <GalleryPhotoModal
        photo={selectedPhoto}
        isOpen={isModalOpen}
        onClose={closePhotoModal}
      />
    </>
  );
}