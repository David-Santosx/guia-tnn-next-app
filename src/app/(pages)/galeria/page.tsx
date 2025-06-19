"use client";

import { useState, useMemo, useEffect } from "react";
import { Calendar, MapPin, User, Tag, Filter, Clock } from "lucide-react";
import LazyImage from "@/components/ui/lazy-image";
import ScrollReveal from "@/components/ui/scroll-reveal";
import PhotoModal from "@/components/ui/photo-modal";
import { GalleryPhoto } from "@/components/gallery/photo-fetcher";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import CollaborateButton from "@/components/ui/collaborate-button";
import { AffiliateBanner } from "@/components/ui/affiliate-banner";

interface PhotoWithSize extends GalleryPhoto {
  size: "small" | "medium" | "large" | "wide" | "tall";
}

export default function Page() {
  const [photos, setPhotos] = useState<PhotoWithSize[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoWithSize | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/galeria");

        if (!response.ok) {
          throw new Error("Failed to fetch photos");
        }

        const data: GalleryPhoto[] = await response.json();

        // Distribuir tamanhos de forma mais equilibrada para o layout responsivo
        const sizesArray: Array<
          "small" | "medium" | "large" | "wide" | "tall"
        > = ["small", "medium", "wide", "tall", "large"];

        // Garantir que fotos grandes e largas não fiquem agrupadas
        const photosWithSizes = data.map((photo, index) => {
          // Evitar muitas fotos grandes em sequência
          const size =
            index % 5 === 0 && index > 0
              ? "small"
              : sizesArray[index % sizesArray.length];

          return {
            ...photo,
            size,
          };
        });

        setPhotos(photosWithSizes);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        console.error("Error fetching photos:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  const handlePhotoClick = (photo: PhotoWithSize) => {
    setSelectedPhoto(photo);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedPhoto(null), 300);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value || null);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value as "newest" | "oldest");
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "Data não informada";
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return "Data inválida";
    }
  };

  const filteredPhotos = useMemo(() => {
    return photos
      .filter((photo) => {
        const matchesCategory = selectedCategory
          ? photo.category === selectedCategory
          : true;
        return matchesCategory;
      })
      .sort((a, b) => {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;

        return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
      });
  }, [photos, sortOrder, selectedCategory]);

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(photos.map((photo) => photo.category).filter(Boolean))
    );
    return uniqueCategories as string[];
  }, [photos]);

  return (
    <main className="py-16 px-6 md:px-12 lg:px-16 bg-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-brand-blue mb-2">
          Galeria de Fotos
        </h1>

        <p className="text-gray-600 mb-8">
          Explore as belezas e momentos especiais de Terra Nova do Norte
        </p>

        {/* Banner de afiliados */}
        <AffiliateBanner />
        <CollaborateButton />

        {/* Filters Section */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 space-y-2">
            <label
              htmlFor="sort-order"
              className="text-sm font-medium text-gray-700 flex items-center"
            >
              <Clock className="w-4 h-4 mr-1 text-brand-blue" />
              Ordenar por data
            </label>
            <select
              id="sort-order"
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue"
              value={sortOrder}
              onChange={handleSortChange}
            >
              <option value="newest">Mais recentes</option>
              <option value="oldest">Mais antigas</option>
            </select>
          </div>

          <div className="flex-1 space-y-2">
            <label
              htmlFor="category-filter"
              className="text-sm font-medium text-gray-700 flex items-center"
            >
              <Filter className="w-4 h-4 mr-1 text-brand-orange" />
              Filtrar por categoria
            </label>
            <select
              id="category-filter"
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue"
              value={selectedCategory || ""}
              onChange={handleCategoryChange}
            >
              <option value="">Todas categorias</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-orange"></div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6">
            <strong className="font-bold">Erro: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredPhotos.length === 0 && (
          <div className="text-center py-16 px-4">
            <div className="max-w-md mx-auto">
              <svg
                className="w-24 h-24 mx-auto text-gray-300 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Nenhuma imagem encontrada
              </h3>
              <p className="text-gray-500 mb-6">
                {selectedCategory
                  ? `Não encontramos fotos na categoria "${selectedCategory}".`
                  : "Não há fotos disponíveis na galeria no momento."}
              </p>
              {selectedCategory && (
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-blue hover:bg-brand-blue/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue"
                >
                  Ver todas as categorias
                </button>
              )}
            </div>
          </div>
        )}

        {/* Responsive Gallery Grid */}
        {!isLoading && !error && filteredPhotos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredPhotos.map((photo, index) => (
              <ScrollReveal
                key={photo.id}
                delay={Math.min(index, 5) * 100}
                direction={index % 2 === 0 ? "up" : "left"}
                preset={index % 3 === 0 ? "zoom" : "slide"}
                duration={800}
                animationConfig={{
                  distance: 25,
                  easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                }}
                className={`relative group overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer h-[280px] sm:h-[250px]
                  ${photo.size === "wide" ? "md:col-span-2" : ""}
                  ${photo.size === "tall" ? "md:row-span-2 md:h-[520px]" : ""}
                  ${
                    photo.size === "large"
                      ? "md:col-span-2 md:row-span-2 md:h-[520px]"
                      : ""
                  }
                  ${photo.size === "medium" ? "md:col-span-2" : ""}`}
                onClick={() => handlePhotoClick(photo)}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10"></div>

                <LazyImage
                  src={photo.imageUrl}
                  alt={photo.title}
                  fill
                  priority={index < 4}
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />

                <div className="absolute bottom-0 left-0 right-0 p-4 z-20 transform transition-transform duration-300">
                  {photo.category && (
                    <div className="flex items-center mb-1">
                      <Tag className="w-4 h-4 text-brand-orange mr-1" />
                      <span className="text-xs text-white/90 font-medium">
                        {photo.category}
                      </span>
                    </div>
                  )}

                  <h3 className="text-xl font-bold text-white mb-1">
                    {photo.title}
                  </h3>

                  <div className="hidden group-hover:block animate-fadeIn">
                    {photo.description && (
                      <p className="text-white/80 text-sm mb-2 line-clamp-2">
                        {photo.description}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-y-1 gap-x-3 text-xs text-white/70">
                      {photo.date && (
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          <span>{formatDate(photo.date)}</span>
                        </div>
                      )}
                      {photo.location && (
                        <div className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          <span>{photo.location}</span>
                        </div>
                      )}
                      {photo.photographer && (
                        <div className="flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          <span>{photo.photographer}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>

      {/* Photo Modal */}
      <PhotoModal
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        photo={selectedPhoto as any}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </main>
  );
}
