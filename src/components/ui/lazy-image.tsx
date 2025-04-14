"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Skeleton from "./skeleton";

interface LazyImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

export default function LazyImage({
  src,
  alt,
  fill = false,
  width,
  height,
  className = "",
  priority = false,
  sizes,
  ...props
}: LazyImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isInView, setIsInView] = useState(false);
  
  useEffect(() => {
    // Skip if priority is true (image will load immediately)
    if (priority) {
      setIsInView(true);
      return;
    }
    
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        setIsInView(true);
        observer.disconnect();
      }
    }, {
      rootMargin: "200px" // Start loading when image is 200px from viewport
    });
    
    const currentElement = document.getElementById(`lazy-image-${src.replace(/\W/g, '')}`);
    if (currentElement) {
      observer.observe(currentElement);
    }
    
    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [src, priority]);
  
  return (
    <div 
      id={`lazy-image-${src.replace(/\W/g, '')}`}
      className={`relative ${className}`}
      style={fill ? { width: '100%', height: '100%' } : { width, height }}
    >
      {isLoading && (
        <Skeleton 
          variant="rounded"
          className={`absolute inset-0 z-10 ${fill ? 'w-full h-full' : ''}`}
        />
      )}
      
      {isInView && (
        <Image
          src={src}
          alt={alt}
          fill={fill}
          width={!fill ? width : undefined}
          height={!fill ? height : undefined}
          className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
          sizes={sizes}
          onLoadingComplete={() => setIsLoading(false)}
          {...props}
        />
      )}
    </div>
  );
}