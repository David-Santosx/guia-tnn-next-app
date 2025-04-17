"use client";

import { useEffect, useRef, ReactNode, useState, useCallback } from "react";

// Animation configuration types
type Direction = "up" | "down" | "left" | "right";
type AnimationPreset = "fade" | "slide" | "zoom" | "flip";

interface AnimationConfig {
  distance?: number;
  opacity?: [number, number];
  scale?: [number, number];
  rotate?: number;
  easing?: string;
}

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  threshold?: number;
  direction?: Direction;
  duration?: number;
  once?: boolean;
  style?: React.CSSProperties;
  onClick?: () => void;
  preset?: AnimationPreset;
  stagger?: number;
  rootMargin?: string;
  disabled?: boolean;
  animationConfig?: Partial<AnimationConfig>;
}

// Default animation configurations
const defaultAnimationConfig: AnimationConfig = {
  distance: 20,
  opacity: [0, 1],
  scale: [1, 1],
  rotate: 0,
  easing: "cubic-bezier(0.25, 0.1, 0.25, 1.0)",
};

// Animation presets
const presets: Record<AnimationPreset, Partial<AnimationConfig>> = {
  fade: { distance: 0, opacity: [0, 1] },
  slide: { distance: 30, opacity: [0, 1] },
  zoom: { scale: [0.9, 1], opacity: [0, 1] },
  flip: { rotate: 15, opacity: [0, 1] },
};

export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  threshold = 0.1,
  direction = "up",
  duration = 700,
  once = true,
  style = {},
  onClick,
  preset,
  stagger = 0,
  rootMargin = "0px 0px -100px 0px",
  disabled = false,
  animationConfig = {},
}: ScrollRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const hasAnimated = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  
  const getConfig = useCallback(() => {
    const baseConfig = { ...defaultAnimationConfig };
    
    if (preset) {
      Object.assign(baseConfig, presets[preset]);
    }
    
    return { ...baseConfig, ...animationConfig };
  }, [preset, animationConfig]);

  const getInitialTransform = useCallback(() => {
    const config = getConfig();
    const { distance, scale, rotate } = config;
    
    let transform = '';
    
    if (distance) {
      switch (direction) {
        case "up": transform += `translateY(${distance}px) `; break;
        case "down": transform += `translateY(-${distance}px) `; break;
        case "left": transform += `translateX(${distance}px) `; break;
        case "right": transform += `translateX(-${distance}px) `; break;
      }
    }
    
    if (scale && scale[0] !== 1) {
      transform += `scale(${scale[0]}) `;
    }
    
    // Apply rotation if defined
    if (rotate) {
      transform += `rotate(${rotate}deg) `;
    }
    
    return transform.trim();
  }, [direction, getConfig]);

  // Reset animation state when children change
  useEffect(() => {
    hasAnimated.current = false;
    setIsVisible(false);
    
    // Force re-observation when children change
    if (observerRef.current && elementRef.current) {
      observerRef.current.unobserve(elementRef.current);
      observerRef.current.observe(elementRef.current);
    }
  }, [children]);

  useEffect(() => {
    if (disabled) return;
    
    const element = elementRef.current;
    if (!element) return;
    
    const config = getConfig();
    
    // Set initial styles
    const initialOpacity = config.opacity ? config.opacity[0] : 0;
    element.style.opacity = initialOpacity.toString();
    element.style.transform = getInitialTransform();
    
    // Fix: Ensure easing is properly applied to the transition
    const easingValue = config.easing || "cubic-bezier(0.25, 0.1, 0.25, 1.0)";
    element.style.transition = `opacity ${duration}ms ${easingValue}, transform ${duration}ms ${easingValue}`;
    element.style.transitionDelay = `${delay}ms`;
    
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      
      if (entry.isIntersecting && (!once || !hasAnimated.current)) {
        // Animate in
        const finalOpacity = config.opacity ? config.opacity[1] : 1;
        const finalScale = config.scale ? config.scale[1] : 1;
        
        element.style.opacity = finalOpacity.toString();
        element.style.transform = finalScale !== 1 ? `scale(${finalScale})` : 'none';
        hasAnimated.current = true;
        setIsVisible(true);
        
        // Disconnect observer if animation should only happen once
        if (once) {
          observer.disconnect();
        }
      } else if (!entry.isIntersecting && !once && hasAnimated.current) {
        // Animate out if not using "once" mode
        element.style.opacity = initialOpacity.toString();
        element.style.transform = getInitialTransform();
        hasAnimated.current = false;
        setIsVisible(false);
      }
    };

    const observer = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
    });
    
    observerRef.current = observer;
    observer.observe(element);

    return () => {
      observer.disconnect();
      observerRef.current = null;
    };
  }, [delay, direction, duration, threshold, once, getInitialTransform, getConfig, rootMargin, disabled]);

  const childrenWithStagger = stagger > 0 && Array.isArray(children)
    ? children.map((child, index) => {
        const config = getConfig();
        const easingValue = config.easing || "cubic-bezier(0.25, 0.1, 0.25, 1.0)";
        
        return (
          <div 
            key={index} 
            style={{ 
              transitionDelay: `${delay + (index * stagger)}ms`,
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'none' : getInitialTransform(),
              transition: `opacity ${duration}ms ${easingValue}, transform ${duration}ms ${easingValue}`,
            }}
          >
            {child}
          </div>
        );
      })
    : children;

  return (
    <div
      ref={elementRef}
      className={className}
      style={{
        ...style,
        willChange: "opacity, transform",
      }}
      onClick={onClick}
    >
      {childrenWithStagger}
    </div>
  );
}