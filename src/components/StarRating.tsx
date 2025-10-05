import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
  allowHalfStars?: boolean;
}

export const StarRating = ({
  rating,
  onRatingChange,
  readonly = false,
  size = "md",
  allowHalfStars = false,
}: StarRatingProps) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const displayRating = hoverRating !== null ? hoverRating : rating;

  const handleStarClick = (starIndex: number, isHalf: boolean = false) => {
    if (readonly || !onRatingChange) return;

    const newRating = allowHalfStars && isHalf ? starIndex - 0.5 : starIndex;
    onRatingChange(newRating);
  };

  const handleMouseEnter = (starIndex: number, isHalf: boolean = false) => {
    if (readonly || !allowHalfStars) return;

    const newRating = isHalf ? starIndex - 0.5 : starIndex;
    setHoverRating(newRating);
  };

  const handleMouseLeave = () => {
    if (readonly) return;
    setHoverRating(null);
  };

  const getStarFill = (starIndex: number) => {
    const diff = displayRating - starIndex;
    if (diff >= 0) return "full";
    if (diff >= -0.5 && allowHalfStars) return "half";
    return "none";
  };

  if (!allowHalfStars) {
    // Original simple star rating for readonly display
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => !readonly && onRatingChange?.(star)}
            disabled={readonly}
            className={cn(
              "transition-all",
              !readonly && "hover:scale-110 cursor-pointer",
              readonly && "cursor-default"
            )}
          >
            <Star
              className={cn(
                sizeClasses[size],
                "transition-colors",
                star <= rating
                  ? "fill-accent text-accent"
                  : "fill-none text-muted-foreground"
              )}
            />
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-1" onMouseLeave={handleMouseLeave}>
      {[1, 2, 3, 4, 5].map((starIndex) => {
        const fillType = getStarFill(starIndex);

        return (
          <div key={starIndex} className="relative">
            {/* Full star clickable area */}
            <button
              type="button"
              onClick={() => handleStarClick(starIndex)}
              onMouseEnter={() => handleMouseEnter(starIndex)}
              disabled={readonly}
              className={cn(
                "transition-all relative",
                !readonly && "hover:scale-110 cursor-pointer",
                readonly && "cursor-default"
              )}
            >
              <Star
                className={cn(
                  sizeClasses[size],
                  "transition-colors",
                  fillType === "full"
                    ? "fill-accent text-accent"
                    : fillType === "half"
                    ? "fill-accent/50 text-accent"
                    : "fill-none text-muted-foreground"
                )}
              />

              {/* Half star overlay for precise half-star display */}
              {fillType === "half" && (
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: "50%" }}
                >
                  <Star
                    className={cn(
                      sizeClasses[size],
                      "fill-accent text-accent transition-colors"
                    )}
                  />
                </div>
              )}
            </button>

            {/* Half star clickable area (left half) */}
            {!readonly && (
              <button
                type="button"
                onClick={() => handleStarClick(starIndex, true)}
                onMouseEnter={() => handleMouseEnter(starIndex, true)}
                className="absolute inset-0 w-1/2 cursor-pointer opacity-0"
                style={{ left: 0 }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
