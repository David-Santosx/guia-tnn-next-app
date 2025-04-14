"use client";

import { useState, useMemo } from "react";
import { Calendar, MapPin, User, Tag, Filter, Clock } from "lucide-react";
import LazyImage from "@/components/ui/lazy-image";
import ScrollReveal from "@/components/ui/scroll-reveal";
import PhotoModal from "@/components/ui/photo-modal";

interface Photo {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  photographer: string;
  category: "Natureza" | "Eventos" | "Locais" | "Festivais";
  imageUrl: string;
  size: "small" | "medium" | "large" | "wide" | "tall";
}

const photos: Photo[] = [
  {
    id: "photo-1",
    title: "Cachoeira do Paraíso",
    date: "15/10/2023",
    location: "Zona Rural",
    description: "Uma das mais belas quedas d'água da região, cercada por vegetação nativa.",
    photographer: "João Silva",
    category: "Natureza",
    imageUrl: "https://fakeimg.pl/600x800/005f73/ffffff?text=Cachoeira+do+Paraíso",
    size: "tall"
  },
  {
    id: "photo-2",
    title: "Festival da Colheita",
    date: "20/09/2023",
    location: "Praça Central",
    description: "Celebração anual que marca o período de colheita com música e gastronomia local.",
    photographer: "Maria Oliveira",
    category: "Festivais",
    imageUrl: "https://fakeimg.pl/800x500/ee9b00/ffffff?text=Festival+da+Colheita",
    size: "wide"
  },
  {
    id: "photo-3",
    title: "Igreja Matriz",
    date: "05/08/2023",
    location: "Centro",
    description: "A histórica igreja matriz que é um dos símbolos arquitetônicos da cidade.",
    photographer: "Carlos Mendes",
    category: "Locais",
    imageUrl: "https://fakeimg.pl/500x600/ae2012/ffffff?text=Igreja+Matriz",
    size: "medium"
  },
  {
    id: "photo-4",
    title: "Roda de Viola",
    date: "12/07/2023",
    location: "Centro Cultural",
    description: "Encontro tradicional de violeiros que mantém viva a cultura musical da região.",
    photographer: "Ana Souza",
    category: "Eventos",
    imageUrl: "https://fakeimg.pl/500x500/9b2226/ffffff?text=Roda+de+Viola",
    size: "small"
  },
  {
    id: "photo-5",
    title: "Rio das Pedras",
    date: "30/06/2023",
    location: "Parque Ecológico",
    description: "Um dos principais pontos turísticos naturais, ideal para banho e contemplação.",
    photographer: "Pedro Costa",
    category: "Natureza",
    imageUrl: "https://fakeimg.pl/800x600/0a9396/ffffff?text=Rio+das+Pedras",
    size: "large"
  },
  {
    id: "photo-6",
    title: "Desfile Cívico",
    date: "07/09/2023",
    location: "Avenida Principal",
    description: "Tradicional desfile de 7 de setembro com participação das escolas e entidades.",
    photographer: "Luiza Ferreira",
    category: "Eventos",
    imageUrl: "https://fakeimg.pl/500x700/001219/ffffff?text=Desfile+Cívico",
    size: "tall"
  },
  {
    id: "photo-7",
    title: "Mercado Municipal",
    date: "15/05/2023",
    location: "Centro",
    description: "Ponto de encontro e comércio local onde se encontram produtos típicos da região.",
    photographer: "Roberto Alves",
    category: "Locais",
    imageUrl: "https://fakeimg.pl/600x400/ca6702/ffffff?text=Mercado+Municipal",
    size: "small"
  },
  {
    id: "photo-8",
    title: "Festival de Inverno",
    date: "22/07/2023",
    location: "Parque de Exposições",
    description: "Evento cultural que reúne música, gastronomia e arte durante o período de inverno.",
    photographer: "Fernanda Lima",
    category: "Festivais",
    imageUrl: "https://fakeimg.pl/600x400/bb3e03/ffffff?text=Festival+de+Inverno",
    size: "medium"
  },
];

export default function Page() {
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Handle photo click to open modal
  const handlePhotoClick = (photo: Photo) => {
    setSelectedPhoto(photo);
    setIsModalOpen(true);
  };
  
  // Handle modal close
  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Optional: delay clearing the photo data to allow for exit animations
    setTimeout(() => setSelectedPhoto(null), 300);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value || null);
  };
  
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value as "newest" | "oldest");
  };

  const filteredPhotos = useMemo(() => {
    return photos
      .filter(photo => {
        const matchesCategory = selectedCategory ? photo.category === selectedCategory : true;
        return matchesCategory;
      })
      .sort((a, b) => {
        const dateA = new Date(a.date.split('/').reverse().join('-'));
        const dateB = new Date(b.date.split('/').reverse().join('-'));
        
        return sortOrder === "newest" 
          ? dateB.getTime() - dateA.getTime() 
          : dateA.getTime() - dateB.getTime();
      });
  }, [sortOrder, selectedCategory]);

  const categories = ["Natureza", "Eventos", "Locais", "Festivais"];

  return (
    <main className="py-16 px-6 md:px-12 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal delay={0} direction="up">
          <h1 className="text-3xl md:text-4xl font-bold text-brand-blue mb-2">
            Galeria de Fotos
          </h1>
        </ScrollReveal>
        
        <ScrollReveal delay={100} direction="up">
          <p className="text-gray-600 mb-8">
            Explore as belezas e momentos especiais de Terra Nova do Norte
          </p>
        </ScrollReveal>
        
        {/* Enhanced Filters Section with Labels and Icons */}
        <ScrollReveal delay={200} direction="up">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 space-y-2">
              <label htmlFor="sort-order" className="text-sm font-medium text-gray-700 flex items-center">
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
              <label htmlFor="category-filter" className="text-sm font-medium text-gray-700 flex items-center">
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
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </ScrollReveal>
        
        {/* Bento Grid Gallery */}
        {filteredPhotos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[250px]">
            {filteredPhotos.map((photo, index) => (
              <ScrollReveal 
                key={photo.id}
                delay={Math.min(index, 5) * 100}
                direction="up"
                className={`relative group overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer
                  ${photo.size === 'wide' ? 'col-span-2' : ''}
                  ${photo.size === 'tall' ? 'row-span-2' : ''}
                  ${photo.size === 'large' ? 'col-span-2 row-span-2' : ''}
                  ${photo.size === 'medium' ? 'col-span-1 row-span-1 sm:col-span-2 sm:row-span-1' : ''}
                  ${photo.size === 'small' ? '' : ''}`}
                onClick={() => handlePhotoClick(photo)}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10"></div>
                
                <LazyImage
                  src={photo.imageUrl}
                  alt={photo.title}
                  fill
                  priority={true}
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20 transform transition-transform duration-300">
                  <div className="flex items-center mb-1">
                    <Tag className="w-4 h-4 text-brand-orange mr-1" />
                    <span className="text-xs text-white/90 font-medium">{photo.category}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-1">{photo.title}</h3>
                  
                  <div className="hidden group-hover:block animate-fadeIn">
                    <p className="text-white/80 text-sm mb-2 line-clamp-2">{photo.description}</p>
                    
                    <div className="flex flex-wrap gap-y-1 gap-x-3 text-xs text-white/70">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        <span>{photo.date}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        <span>{photo.location}</span>
                      </div>
                      <div className="flex items-center">
                        <User className="w-3 h-3 mr-1" />
                        <span>{photo.photographer}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <ScrollReveal>
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Nenhuma foto encontrada com os filtros selecionados.</p>
            </div>
          </ScrollReveal>
        )}
      </div>
      
      {/* Photo Modal */}
      <PhotoModal 
        photo={selectedPhoto}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </main>
  );
}