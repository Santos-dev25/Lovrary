import React from "react";

interface LovraryLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
  textClassName?: string;
}

export const LovraryLogo: React.FC<LovraryLogoProps> = ({
  size = 32,
  className = "",
  showText = false,
  textClassName = "",
}) => {
  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 group-hover:scale-105"
      >
        <defs>
          <linearGradient id="lovrary-grad-primary" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--marsala))" />
            <stop offset="100%" stopColor="hsl(var(--marsala-dark, 348 55% 22%))" />
          </linearGradient>
          <linearGradient id="lovrary-grad-gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--gold))" />
            <stop offset="100%" stopColor="hsl(var(--gold-light, 38 60% 75%))" />
          </linearGradient>
        </defs>

        {/* Outer squircle tile with gentle shadow */}
        <rect
          x="1"
          y="1"
          width="38"
          height="38"
          rx="10"
          className="fill-card stroke-border"
          strokeWidth="1.5"
        />

        {/* Left Book Page */}
        <path
          d="M19 13C15 11.5 11 12 9 13.2V27.5C11 26.2 15 25.8 19 27.2V13Z"
          fill="url(#lovrary-grad-primary)"
          opacity="0.95"
        />

        {/* Right Book Page */}
        <path
          d="M21 13C25 11.5 29 12 31 13.2V27.5C29 26.2 25 25.8 21 27.2V13Z"
          fill="url(#lovrary-grad-primary)"
        />

        {/* Book Spine Center line */}
        <line
          x1="20"
          y1="13"
          x2="20"
          y2="27.5"
          stroke="hsl(var(--card))"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Bookmark ribbon in antique gold */}
        <path
          d="M23.5 12V21L21.5 19.5L19.5 21V12"
          fill="url(#lovrary-grad-gold)"
        />

        {/* Subtle literary sparkle at top right */}
        <circle cx="29" cy="10" r="1.5" fill="hsl(var(--gold))" />
      </svg>

      {showText && (
        <span
          className={`font-display text-xl font-bold tracking-tight text-marsala ${textClassName}`}
        >
          lovrary
        </span>
      )}
    </div>
  );
};

export default LovraryLogo;
