import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StarRating } from "./StarRating";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface ReviewCardProps {
  id: string;
  rating: number;
  reviewText: string;
  userName: string;
  createdAt: string;
  isOwner: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const ReviewCard = ({
  rating,
  reviewText,
  userName,
  createdAt,
  isOwner,
  onEdit,
  onDelete,
}: ReviewCardProps) => {
  return (
    <Card className="bg-gradient-to-br from-card to-card/80">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{userName}</CardTitle>
            <CardDescription>
              {format(new Date(createdAt), "MMMM d, yyyy")}
            </CardDescription>
          </div>
          {isOwner && (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={onEdit}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onDelete}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        <StarRating rating={rating} readonly size="sm" allowHalfStars />
      </CardHeader>
      <CardContent>
        <p className="text-foreground/90 whitespace-pre-wrap">{reviewText}</p>
      </CardContent>
    </Card>
  );
};
