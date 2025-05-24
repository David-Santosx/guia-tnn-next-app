"use client";

import Image from "next/image";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import Link from "next/link";

interface Event {
  id: string;
  title: string;
  description: string;
  organization: string;
  date: string;
  time: string;
  location: string;
  imageUrl: string;
}

interface EventCardProps {
  event: Event;
  className?: string; // Nova propriedade para estilização personalizada
}

export default function EventCard({ event, className = "" }: EventCardProps) {
  // Formatar a data para exibição
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  return (
    <Link href={`/eventos/${event.id}`} className="block">
      <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className} hover:shadow-lg transition-all duration-300`}>
        <div className="relative h-48">
          <Image
            src={event.imageUrl || "/images/event-placeholder.jpg"}
            alt={event.title}
            fill
            className="object-contain md:object-cover bg-gray-50"
            sizes="(max-width: 768px) 100vw, 384px"
          />
        </div>
        <div className="p-4">
          <h3 className="text-xl font-semibold text-brand-blue mb-2 line-clamp-2">
            {event.title}
          </h3>
          <p className="text-gray-600 mb-4 line-clamp-3">{event.description}</p>
          
          <div className="space-y-2 text-sm text-gray-500">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-brand-orange" />
              <span>{formatDate(event.date)}</span>
            </div>
            {event.time && (
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2 text-brand-orange" />
                <span>{event.time}</span>
              </div>
            )}
            {event.location && (
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-brand-orange" />
                <span>{event.location}</span>
              </div>
            )}
            {event.organization && (
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2 text-brand-orange" />
                <span>{event.organization}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}