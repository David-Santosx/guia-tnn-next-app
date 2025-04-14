"use client";

import { useEffect, useState } from "react";

interface TypewriterProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  highlightText?: string;
  highlightClassName?: string;
}

export default function Typewriter({
  text,
  speed = 100,
  delay = 0,
  className = "",
  highlightText = "",
  highlightClassName = "",
}: TypewriterProps) {
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    
    const startTimer = setTimeout(() => {
      setIsTyping(true);
      let currentIndex = 0;
      
      const typingInterval = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayText(text.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);
        }
      }, speed);
      
      return () => clearInterval(typingInterval);
    }, delay);
    
    return () => clearTimeout(startTimer);
  }, [text, speed, delay]);

  if (highlightText && text.includes(highlightText)) {
    const parts = text.split(highlightText);
    const beforeHighlight = parts[0];
    
    const beforeDisplayed = displayText.slice(0, beforeHighlight.length);
    const highlightDisplayed = displayText.slice(
      beforeHighlight.length,
      beforeHighlight.length + highlightText.length
    );
    const afterDisplayed = displayText.slice(beforeHighlight.length + highlightText.length);

    return (
      <div className={className}>
        {beforeDisplayed}
        {highlightDisplayed && (
          <span className={highlightClassName}>{highlightDisplayed}</span>
        )}
        {afterDisplayed}
        {isTyping && <span className="animate-pulse">|</span>}
      </div>
    );
  }

  return (
    <div className={className}>
      {displayText}
      {isTyping && <span className="animate-pulse">|</span>}
    </div>
  );
}