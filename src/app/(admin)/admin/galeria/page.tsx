"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Plus, Trash2, Loader2, AlertCircle, ImageOff, Calendar, MapPin, User } from "lucide-react";
import { AddPhotoModal } from '@/components/admin/galeria/add-photo-modal';
import { DeletePhotoModal } from '@/components/admin/galeria/delete-photo-modal';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Photo {
  id: string;
  title: string;
  description?: string | null;
  imageUrl: string;
  category?: string | null;
  photographer?: string | null;
  location?: string | null;
  date?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export default function GalleryAdminPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [, setIsDeleting] = useState(false);

  const fetchPhotos = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/galeria");
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Falha ao buscar fotos da galeria");
      }
      const data = await response.json();
      setPhotos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocorreu um erro desconhecido");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  const refreshPhotos = () => {
    fetchPhotos();
  };

  const handleAddPhoto = () => {
    setIsAddModalOpen(true);
  };

  const handleDeletePhoto = (photo: Photo) => {
    setSelectedPhoto(photo);
    setIsDeleteModalOpen(true);
  };

  const confirmDeletePhoto = async () => {
    if (!selectedPhoto) return;
    
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/galeria/${selectedPhoto.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Falha ao excluir a foto");
      }
      
      refreshPhotos();
    } catch (error) {
      console.error("Delete error:", error);
      throw error;
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "Não informada";
    try {
      return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return "Data inválida";
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gerenciar Galeria</h1>
        <button
          onClick={handleAddPhoto}
          className="flex items-center gap-2 px-4 py-2 bg-brand-orange text-white rounded-md hover:bg-brand-orange/90 transition-colors text-sm font-medium"
        >
          <Plus size={18} />
          Adicionar Foto
        </button>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-brand-orange" />
          <span className="ml-2 text-gray-400">Carregando fotos...</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-900/20 border border-red-800 rounded-md text-red-300 flex items-center gap-3">
          <AlertCircle size={20} />
          <div>
            <h2 className="font-semibold mb-1">Erro ao carregar fotos</h2>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {!isLoading && !error && photos.length === 0 && (
         <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-500">
           <ImageOff size={48} className="mb-4" />
           <p className="text-lg font-medium">Nenhuma foto encontrada.</p>
           <p>Clique em &quot;Adicionar Foto&quot; para começar.</p>
         </div>
      )}

      {!isLoading && !error && photos.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {photos.map((photo) => (
            <div key={photo.id} className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 shadow-md flex flex-col transition-transform hover:scale-[1.02] hover:shadow-xl">
              <div className="relative aspect-video">
                <Image
                  src={photo.imageUrl}
                  alt={photo.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder-image.png";
                  }}
                />
                {photo.category && (
                  <div className="absolute top-2 right-2 bg-brand-orange/90 text-white text-xs px-2 py-1 rounded">
                    {photo.category}
                  </div>
                )}
              </div>
              
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-base font-semibold text-white mb-2" title={photo.title}>
                  {photo.title}
                </h3>
                
                {photo.description && (
                  <p className="text-sm text-gray-300 mb-3 line-clamp-2" title={photo.description}>
                    {photo.description}
                  </p>
                )}
                
                <div className="mt-auto space-y-2 text-xs text-gray-400">
                  {photo.photographer && (
                    <div className="flex items-center gap-1.5">
                      <User size={14} className="text-gray-500" />
                      <span title={`Fotógrafo: ${photo.photographer}`}>{photo.photographer}</span>
                    </div>
                  )}
                  
                  {photo.location && (
                    <div className="flex items-center gap-1.5">
                      <MapPin size={14} className="text-gray-500" />
                      <span title={`Local: ${photo.location}`}>{photo.location}</span>
                    </div>
                  )}
                  
                  {photo.date && (
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-gray-500" />
                      <span title={`Data: ${formatDate(photo.date)}`}>
                        {formatDate(photo.date)}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={() => handleDeletePhoto(photo)}
                    className="p-1.5 bg-red-900/40 hover:bg-red-900/60 text-red-300 rounded text-xs flex items-center gap-1"
                  >
                    <Trash2 size={12} />
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddPhotoModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onPhotoAdded={refreshPhotos}
      />

      <DeletePhotoModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeletePhoto}
        photoTitle={selectedPhoto?.title || ""}
      />
    </div>
  );
}