"use client";

import { useEffect, useRef, ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  threshold?: number;
  direction?: "up" | "down" | "left" | "right";
  duration?: number;
  once?: boolean;
  style?: React.CSSProperties;
  onClick?: () => void; // Add onClick handler prop
}

export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  threshold = 0.1,
  direction = "up",
  duration = 700,
  once = true,
  style = {},
  onClick, // Destructure the onClick prop
}: ScrollRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  // Determine transform based on direction
  const getInitialTransform = () => {
    switch (direction) {
      case "up": return "translateY(20px)";
      case "down": return "translateY(-20px)";
      case "left": return "translateX(20px)";
      case "right": return "translateX(-20px)";
      default: return "translateY(20px)";
    }
  };

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Set initial styles
    element.style.opacity = "0";
    element.style.transform = getInitialTransform();
    element.style.transition = `opacity ${duration}ms ease, transform ${duration}ms ease`;
    element.style.transitionDelay = `${delay}ms`;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && (!once || !hasAnimated.current)) {
          // Animate in
          element.style.opacity = "1";
          element.style.transform = "translate(0, 0)";
          hasAnimated.current = true;

          // Disconnect observer if animation should only happen once
          if (once) {
            observer.disconnect();
          }
        } else if (!entry.isIntersecting && !once && hasAnimated.current) {
          // Animate out if not using "once" mode
          element.style.opacity = "0";
          element.style.transform = getInitialTransform();
          hasAnimated.current = false;
        }
      },
      {
        threshold,
        rootMargin: "0px 0px -100px 0px",
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [delay, direction, duration, once, threshold]);

  return (
    <div
      ref={elementRef}
      className={className}
      style={{
        ...style,
        willChange: "opacity, transform",
      }}
      onClick={onClick} // Add the onClick handler to the div
    >
      {children}
    </div>
  );
}