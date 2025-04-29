'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

interface AdvertisementProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  containerClassName?: string;
  href?: string;
  position?: 'fixed' | 'relative' | 'absolute';
  onClick?: () => void;
  imageType?: 'gif' | 'jpg' | 'jpeg' | 'png';
  isActive?: boolean;
  startDate?: Date;
  endDate?: Date;
  id?: string;
}

export function Advertisement({
  src,
  alt,
  width = 300,
  height = 250,
  priority = false,
  className,
  containerClassName,
  href,
  position = 'relative',
  onClick,
  isActive = true,
  startDate,
  endDate,
  id,
}: AdvertisementProps) {
  if (!isActive) return null;

  if (startDate && endDate) {
    const now = new Date();
    if (now < startDate || now > endDate) return null;
  }

  const imageComponent = (
    <div
      className={cn(
        'overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300',
        position === 'fixed' && 'fixed z-50',
        containerClassName
      )}
      data-ad-id={id}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        className={cn(
          'w-full h-full object-cover hover:scale-105 transition-transform duration-300',
          className
        )}
        onClick={onClick}
      />
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
        data-ad-id={id}
      >
        {imageComponent}
      </a>
    );
  }

  return imageComponent;
}