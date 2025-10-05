import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "./StarRating";
import { useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";

interface BookCardProps {
  id: string;
  title: string;
  author: string;
  genre: string;
  publishedYear: number;
  averageRating: number;
  reviewCount: number;
}

export const BookCard = ({
  id,
  title,
  author,
  genre,
  publishedYear,
  averageRating,
  reviewCount,
}: BookCardProps) => {
  const navigate = useNavigate();

  return (
    <Card
      className="cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 bg-gradient-to-br from-card to-card/80 border-border"
      onClick={() => navigate(`/book/${id}`)}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-xl mb-1 line-clamp-2">{title}</CardTitle>
            <CardDescription className="flex items-center gap-2 text-base">
              <BookOpen className="h-4 w-4" />
              {author}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <StarRating
              rating={averageRating}
              readonly
              size="sm"
              allowHalfStars
            />
            <span className="text-sm text-muted-foreground">
              {averageRating.toFixed(1)} ({reviewCount}{" "}
              {reviewCount === 1 ? "review" : "reviews"})
            </span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary">{genre}</Badge>
            <Badge variant="outline">{publishedYear}</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
