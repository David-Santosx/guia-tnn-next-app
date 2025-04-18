import React from 'react';

interface CreditsProps {
  className?: string;
  variant?: 'light' | 'dark';
  showYear?: boolean;
  compact?: boolean;
}

export function Credits({ 
  className = '', 
  variant = 'light', 
  showYear = true,
  compact = false
}: CreditsProps) {
  const currentYear = new Date().getFullYear();
  const year = currentYear === 2025 ? '2025' : `2025-${currentYear}`;
  
  const textColorClass = variant === 'light' 
    ? 'text-gray-700' 
    : 'text-gray-300';
  
  const highlightColorClass = variant === 'light'
    ? 'text-brand-blue'
    : 'text-brand-orange';

  if (compact) {
    return (
      <div className={`text-xs sm:text-sm flex flex-wrap items-center justify-center gap-1 sm:gap-0 ${textColorClass} ${className}`}>
        <span>© {showYear ? year : '2025'} • Desenvolvido por</span>
        <span className={`${highlightColorClass} font-medium mx-1`}>David Santos</span>
      </div>
    );
  }

  return (
    <div className={`text-center ${textColorClass} ${className}`}>
      <p className="text-xs sm:text-sm">
        © {showYear ? year : '2025'} • Todos os direitos reservados
      </p>
      <div className="text-xs sm:text-sm mt-1 flex flex-wrap items-center justify-center gap-1 sm:gap-0">
        <span>Idealizado e desenvolvido por</span>
        <span className={`${highlightColorClass} font-medium mx-1`}>David Santos</span>
      </div>
    </div>
  );
}