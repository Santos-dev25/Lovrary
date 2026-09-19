import React, { useState } from "react";
import { Star } from "lucide-react";

interface RatingStarsProps {
  value: number;
  onChange?: (val: number) => void;
  size?: "xs" | "sm" | "md" | "lg";
  showValue?: boolean;
  className?: string;
  readOnly?: boolean;
}

const sizeMap = {
  xs: { icon: "w-3 h-3", container: "gap-0.5", text: "text-[10px]" },
  sm: { icon: "w-3.5 h-3.5", container: "gap-0.5", text: "text-xs" },
  md: { icon: "w-4 h-4 sm:w-4.5 sm:h-4.5", container: "gap-1", text: "text-xs font-semibold" },
  lg: { icon: "w-5 h-5 sm:w-6 sm:h-6", container: "gap-1.5", text: "text-sm font-bold" },
};

export const RatingStars: React.FC<RatingStarsProps> = ({
  value,
  onChange,
  size = "md",
  showValue = false,
  className = "",
  readOnly = false,
}) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const displayValue = hoverValue !== null ? hoverValue : Number(value) || 0;
  const isInteractive = !readOnly && typeof onChange === "function";
  const { icon, container, text } = sizeMap[size] || sizeMap.md;

  return (
    <div
      className={`inline-flex items-center ${container} ${className}`}
      onMouseLeave={() => isInteractive && setHoverValue(null)}
    >
      <div className={`flex items-center ${container}`}>
        {Array.from({ length: 5 }).map((_, i) => {
          const starBaseValue = i;
          const isFull = displayValue >= starBaseValue + 1;
          const isHalf = !isFull && displayValue >= starBaseValue + 0.5;

          return (
            <div
              key={i}
              className={`relative inline-flex items-center justify-center select-none ${
                isInteractive ? "cursor-pointer hover:scale-110 active:scale-95 transition-transform" : ""
              }`}
            >
              {/* Estrela de Fundo (Vazia) */}
              <Star
                className={`${icon} transition-colors ${
                  isInteractive
                    ? "text-muted-foreground/30"
                    : "text-border/80 dark:text-muted-foreground/30"
                }`}
              />

              {/* Camada Sobreposta (Preenchimento Dourado: 100% para cheia, 50% para meia) */}
              <div
                className="absolute top-0 left-0 h-full overflow-hidden pointer-events-none transition-[width] duration-150"
                style={{
                  width: isFull ? "100%" : isHalf ? "50%" : "0%",
                }}
              >
                <Star className={`${icon} fill-gold text-gold shrink-0`} />
              </div>

              {/* Zonas interativas para clique/toque (Metade Esquerda: 0.5, Metade Direita: 1.0) */}
              {isInteractive && (
                <>
                  {/* Zona esquerda: i + 0.5 */}
                  <button
                    type="button"
                    onClick={() => onChange(starBaseValue + 0.5)}
                    onMouseEnter={() => setHoverValue(starBaseValue + 0.5)}
                    className="absolute top-0 left-0 w-1/2 h-full z-10 opacity-0 cursor-pointer touch-manipulation"
                    aria-label={`Avaliar ${starBaseValue + 0.5} estrelas`}
                    title={`${starBaseValue + 0.5} estrelas`}
                  />
                  {/* Zona direita: i + 1.0 */}
                  <button
                    type="button"
                    onClick={() => onChange(starBaseValue + 1.0)}
                    onMouseEnter={() => setHoverValue(starBaseValue + 1.0)}
                    className="absolute top-0 right-0 w-1/2 h-full z-10 opacity-0 cursor-pointer touch-manipulation"
                    aria-label={`Avaliar ${starBaseValue + 1.0} estrelas`}
                    title={`${starBaseValue + 1.0} estrelas`}
                  />
                </>
              )}
            </div>
          );
        })}
      </div>

      {showValue && (
        <span className={`font-numeric text-foreground ml-1.5 ${text}`}>
          {displayValue > 0 ? displayValue.toFixed(1) : "—"}
        </span>
      )}
    </div>
  );
};

export default RatingStars;
