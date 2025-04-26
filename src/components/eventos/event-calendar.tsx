"use client";

import { useState } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  imageUrl: string;
}

interface EventCalendarProps {
  events: Event[];
}

export default function EventCalendar({ events }: EventCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  // Obter dias do mês atual
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Navegar para o mês anterior
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };
  
  // Navegar para o próximo mês
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };
  
  // Verificar se um dia tem eventos
  const hasEvents = (day: Date) => {
    return events.some(event => isSameDay(parseISO(event.date), day));
  };
  
  // Obter eventos para um dia específico
  const getEventsForDay = (day: Date) => {
    return events.filter(event => isSameDay(parseISO(event.date), day));
  };
  
  return (
    <div className="bg-white rounded-lg shadow">
      {/* Cabeçalho do calendário */}
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="text-xl font-semibold text-brand-blue flex items-center">
          <CalendarIcon className="mr-2 h-5 w-5 text-brand-orange" />
          {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
        </h3>
        <div className="flex space-x-2">
          <button 
            onClick={prevMonth}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Mês anterior"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <button 
            onClick={nextMonth}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Próximo mês"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>
      
      {/* Grade do calendário */}
      <div className="p-4">
        {/* Dias da semana */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>
        
        {/* Dias do mês */}
        <div className="grid grid-cols-7 gap-1">
          {monthDays.map((day, i) => {
            const dayHasEvents = hasEvents(day);
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            
            return (
              <button
                key={i}
                onClick={() => setSelectedDate(isSelected ? null : day)}
                className={`
                  relative h-14 p-1 rounded-md transition-colors
                  ${isSelected ? 'bg-brand-blue text-white' : dayHasEvents ? 'hover:bg-blue-50' : 'hover:bg-gray-50'}
                `}
              >
                <span className="text-sm">{format(day, 'd')}</span>
                {dayHasEvents && !isSelected && (
                  <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-brand-orange rounded-full"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Lista de eventos do dia selecionado */}
      {selectedDate && (
        <div className="border-t p-4">
          <h4 className="font-medium mb-3">
            Eventos em {format(selectedDate, 'dd/MM/yyyy')}
          </h4>
          <div className="space-y-3">
            {getEventsForDay(selectedDate).length > 0 ? (
              getEventsForDay(selectedDate).map(event => (
                <Link 
                  href={`/eventos/${event.id}`} 
                  key={event.id}
                  className="flex items-center p-2 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <div 
                    className="w-10 h-10 rounded-md bg-cover bg-center mr-3" 
                    style={{ backgroundImage: `url(${event.imageUrl})` }}
                  />
                  <div>
                    <p className="font-medium text-brand-blue">{event.title}</p>
                    <p className="text-sm text-gray-500">{event.time}</p>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-gray-500 text-sm">Nenhum evento neste dia</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}