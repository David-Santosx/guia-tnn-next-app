"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { CalendarIcon, ClockIcon, MapPinIcon } from "lucide-react";
import Link from "next/link";

import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

function formatDate(date: string): string {
  const parsedDate = parseISO(date);
  return format(parsedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
}

interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  imageUrl: string;
}

interface EventsCarouselProps {
  events: Event[];
  autoRotateInterval?: number;
}

export default function EventsCarousel({
  events,
  autoRotateInterval = 3000,
}: EventsCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Set up intersection observer to detect when carousel is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.2, // Consider visible when 20% of the carousel is in view
        rootMargin: "0px",
      }
    );

    if (carouselRef.current) {
      observer.observe(carouselRef.current);
    }

    return () => {
      if (carouselRef.current) {
        observer.unobserve(carouselRef.current);
      }
    };
  }, []);

  // Only auto-rotate when the carousel is visible
  useEffect(() => {
    if (!isVisible || !autoRotateInterval) return;

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % events.length);
    }, autoRotateInterval);

    return () => clearInterval(interval);
  }, [events.length, autoRotateInterval, isVisible]);

  return (
    <div
      ref={carouselRef}
      className="relative max-w-5xl mx-auto h-[550px] md:h-[500px]"
    >
      {events.map((event, index) => {
        const displayIndex =
          (index - activeIndex + events.length) % events.length;

        return (
          <Link
            key={event.id}
            href={`/eventos/${event.id}`}
            className={`absolute w-full max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden 
              transition-all duration-500 ease-in-out cursor-pointer hover:shadow-xl
              ${
                displayIndex === 0
                  ? "top-0 left-0 right-0 z-30 scale-100 opacity-100"
                  : displayIndex === 1
                  ? "top-5 left-5 right-5 z-20 scale-[0.98] opacity-90"
                  : "top-10 left-10 right-10 z-10 scale-[0.96] opacity-80"
              }`}
            style={{
              transform: `rotate(${displayIndex * 1 - 1}deg)`,
            }}
          >
            <div className="md:flex">
              <div className="md:shrink-0 h-56 md:h-auto md:w-64 relative">
                <Image
                  src={event.imageUrl}
                  alt={event.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6 md:p-8 flex-1">
                <h3 className="text-2xl font-bold text-brand-blue mb-3">
                  {event.title}
                </h3>
                <p className="text-gray-600 mb-6 text-base line-clamp-3">
                  {event.description}
                </p>

                <div className="space-y-3">
                  <div className="flex items-center text-sm md:text-base text-gray-500">
                    <CalendarIcon className="w-5 h-5 mr-3 text-brand-orange" />
                    <span>{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center text-sm md:text-base text-gray-500">
                    <ClockIcon className="w-5 h-5 mr-3 text-brand-orange" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center text-sm md:text-base text-gray-500">
                    <MapPinIcon className="w-5 h-5 mr-3 text-brand-orange" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}