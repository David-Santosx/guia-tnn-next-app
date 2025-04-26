"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin, Building } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Event {
  id: string;
  title: string;
  description: string;
  organization: string;
  date: string;
  time: string;
  location: string;
  imageUrl: string;
  createdAt: string;
  createdBy: string;
}

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  // Formatar a data para exibição
  const formattedDate = format(parseISO(event.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  
  return (
    <Link 
      href={`/eventos/${event.id}`}
      className="group bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-lg"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={event.imageUrl}
          alt={event.title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-70" />
        <div className="absolute bottom-3 left-3 right-3">
          <span className="inline-block px-3 py-1 bg-brand-orange text-white text-sm font-medium rounded-full">
            {formattedDate}
          </span>
        </div>
      </div>
      
      <div className="p-4 space-y-3">
        <h3 className="text-xl font-bold text-brand-blue line-clamp-2 group-hover:text-brand-orange transition-colors">
          {event.title}
        </h3>
        
        <p className="text-gray-600 text-sm line-clamp-3">
          {event.description}
        </p>
        
        <div className="pt-2 space-y-2">
          <div className="flex items-center text-sm text-gray-500">
            <Building className="w-4 h-4 mr-2 text-brand-orange" />
            <span className="line-clamp-1">{event.organization}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-2 text-brand-orange" />
            <span>{event.time}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="w-4 h-4 mr-2 text-brand-orange" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}