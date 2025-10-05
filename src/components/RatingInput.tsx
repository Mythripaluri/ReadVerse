import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface RatingInputProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const RatingInput = ({
  rating,
  onRatingChange,
  size = "md",
  className,
}: RatingInputProps) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  // Available rating options: 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0
  const ratingOptions = [0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0];

  const displayRating = hoverRating !== null ? hoverRating : rating;

  const handleRatingClick = (selectedRating: number) => {
    onRatingChange(selectedRating);
  };

  const handleMouseEnter = (selectedRating: number) => {
    setHoverRating(selectedRating);
  };

  const handleMouseLeave = () => {
    setHoverRating(null);
  };

  const getStarDisplay = (starPosition: number) => {
    const diff = displayRating - starPosition;
    if (diff >= 0) return "full";
    if (diff >= -0.5) return "half";
    return "empty";
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* Star Display */}
      <div className="flex gap-1" onMouseLeave={handleMouseLeave}>
        {[1, 2, 3, 4, 5].map((starPosition) => {
          const display = getStarDisplay(starPosition);

          return (
            <div key={starPosition} className="relative">
              <Star
                className={cn(
                  sizeClasses[size],
                  "transition-all duration-200",
                  display === "full"
                    ? "fill-accent text-accent"
                    : display === "half"
                    ? "fill-none text-accent"
                    : "fill-none text-muted-foreground"
                )}
              />

              {/* Half star fill */}
              {display === "half" && (
                <div className="absolute inset-0 overflow-hidden w-1/2">
                  <Star
                    className={cn(
                      sizeClasses[size],
                      "fill-accent text-accent transition-all duration-200"
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Rating Value Display */}
      <div className="text-center">
        <span className="text-lg font-medium">
          {displayRating === 0
            ? "Select a rating"
            : `${displayRating} star${displayRating === 1 ? "" : "s"}`}
        </span>
      </div>

      {/* Rating Selection Buttons */}
      <div className="grid grid-cols-5 gap-2">
        {ratingOptions.map((ratingValue) => (
          <button
            key={ratingValue}
            type="button"
            onClick={() => handleRatingClick(ratingValue)}
            onMouseEnter={() => handleMouseEnter(ratingValue)}
            className={cn(
              "px-3 py-2 rounded-lg border transition-all text-sm font-medium",
              "hover:bg-accent hover:text-accent-foreground hover:scale-105",
              rating === ratingValue
                ? "bg-accent text-accent-foreground border-accent"
                : "bg-background border-border text-muted-foreground"
            )}
          >
            {ratingValue}
          </button>
        ))}
      </div>

      {/* Quick Rating Buttons */}
      <div className="flex justify-center gap-2 pt-2">
        <button
          type="button"
          onClick={() => handleRatingClick(2.5)}
          className="px-3 py-1 rounded-md bg-red-100 text-red-700 hover:bg-red-200 text-xs font-medium transition-colors"
        >
          Poor (2.5)
        </button>
        <button
          type="button"
          onClick={() => handleRatingClick(3.5)}
          className="px-3 py-1 rounded-md bg-yellow-100 text-yellow-700 hover:bg-yellow-200 text-xs font-medium transition-colors"
        >
          Fair (3.5)
        </button>
        <button
          type="button"
          onClick={() => handleRatingClick(4.0)}
          className="px-3 py-1 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 text-xs font-medium transition-colors"
        >
          Good (4.0)
        </button>
        <button
          type="button"
          onClick={() => handleRatingClick(4.5)}
          className="px-3 py-1 rounded-md bg-green-100 text-green-700 hover:bg-green-200 text-xs font-medium transition-colors"
        >
          Great (4.5)
        </button>
        <button
          type="button"
          onClick={() => handleRatingClick(5.0)}
          className="px-3 py-1 rounded-md bg-purple-100 text-purple-700 hover:bg-purple-200 text-xs font-medium transition-colors"
        >
          Excellent (5.0)
        </button>
      </div>
    </div>
  );
};
