import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { booksAPI, reviewsAPI } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { StarRating } from "@/components/StarRating";
import { RatingInput } from "@/components/RatingInput";
import { ReviewCard } from "@/components/ReviewCard";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Edit, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { z } from "zod";

const reviewSchema = z.object({
  rating: z
    .number()
    .min(0.5, "Please select a rating")
    .max(5)
    .refine((val) => (val * 2) % 1 === 0, {
      message:
        "Rating must be in 0.5 increments (0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0)",
    }),
  reviewText: z
    .string()
    .trim()
    .min(10, "Review must be at least 10 characters")
    .max(1000, "Review must be less than 1000 characters"),
});

interface Book {
  id: string;
  _id?: string;
  title: string;
  author: string;
  description: string;
  genre: string;
  publishedYear: number;
  published_year?: number;
  addedBy: string;
  added_by?: string;
  averageRating?: number;
  displayRating?: number;
  reviewCount?: number;
}

interface Review {
  id: string;
  book_id: string;
  user_id: string;
  rating: number;
  review_text: string;
  created_at: string;
  updated_at: string;
  userName?: string;
}

interface BackendReview {
  _id: string;
  book: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  rating: number;
  reviewText: string;
  createdAt: string;
  updatedAt: string;
}

export default function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [book, setBook] = useState<Book | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingReview, setEditingReview] = useState(false);

  const fetchBookAndReviews = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch book
      const bookResponse = await booksAPI.getBook(id!);
      if (!bookResponse.success) throw new Error(bookResponse.message);

      // Map backend book structure to frontend interface
      const mappedBook: Book = {
        ...bookResponse.data,
        id: bookResponse.data._id || bookResponse.data.id,
        published_year: bookResponse.data.publishedYear,
        added_by: bookResponse.data.addedBy,
      };
      setBook(mappedBook);

      // Fetch reviews for this book
      const reviewsResponse = await booksAPI.getBookReviews(id!);
      if (!reviewsResponse.success) throw new Error(reviewsResponse.message);

      const reviewsWithNames: Review[] = reviewsResponse.data.map(
        (review: BackendReview) => ({
          ...review,
          id: review._id,
          book_id: review.book,
          user_id: review.user._id,
          review_text: review.reviewText,
          userName: review.user.name || "Anonymous",
          created_at: review.createdAt,
          updated_at: review.updatedAt,
        })
      );

      setReviews(reviewsWithNames);

      // Find user's review if logged in
      if (user) {
        const myReview = reviewsWithNames.find(
          (r: Review) => r.user_id === user.id
        );
        if (myReview) {
          setUserReview(myReview);
          setRating(myReview.rating);
          setReviewText(myReview.review_text);
          setEditingReview(true);
        }
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load book details";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [id, user]);

  useEffect(() => {
    fetchBookAndReviews();
  }, [fetchBookAndReviews]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please sign in to leave a review");
      navigate("/auth");
      return;
    }

    try {
      reviewSchema.parse({ rating, reviewText });
      setSubmitting(true);

      if (userReview) {
        // Update existing review
        const response = await reviewsAPI.updateReview(userReview.id, {
          rating,
          reviewText,
        });

        if (!response.success) throw new Error(response.message);
        toast.success("Review updated successfully!");
      } else {
        // Create new review
        const response = await reviewsAPI.createReview({
          book: id!,
          rating,
          reviewText,
        });

        if (!response.success) throw new Error(response.message);
        toast.success("Review added successfully!");
      }

      fetchBookAndReviews();
      setRating(0);
      setReviewText("");
      setEditingReview(false);
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to submit review");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!userReview) return;

    try {
      const response = await reviewsAPI.deleteReview(userReview.id);

      if (!response.success) throw new Error(response.message);
      toast.success("Review deleted successfully!");
      setUserReview(null);
      setRating(0);
      setReviewText("");
      setEditingReview(false);
      fetchBookAndReviews();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete review";
      toast.error(errorMessage);
    } finally {
      setShowDeleteDialog(false);
    }
  };

  const handleDeleteBook = async () => {
    if (!book) return;

    try {
      const response = await booksAPI.deleteBook(book.id);

      if (!response.success) throw new Error(response.message);
      toast.success("Book deleted successfully!");
      navigate("/");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete book";
      toast.error(errorMessage);
    }
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </>
    );
  }

  if (!book) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-xl text-muted-foreground">Book not found</p>
        </div>
      </>
    );
  }

  const averageRating = calculateAverageRating();
  const isBookOwner = user?.id === book.added_by;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Card className="mb-8 bg-gradient-to-br from-card to-card/80">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <BookOpen className="h-8 w-8 text-accent" />
                    <CardTitle className="text-3xl">{book.title}</CardTitle>
                  </div>
                  <CardDescription className="text-lg">
                    by {book.author}
                  </CardDescription>
                </div>
                {isBookOwner && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/edit-book/${book.id}`)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleDeleteBook}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground/90">{book.description}</p>
              <div className="flex items-center gap-4 flex-wrap">
                <Badge variant="secondary">{book.genre}</Badge>
                <Badge variant="outline">{book.published_year}</Badge>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t">
                <StarRating rating={averageRating} readonly allowHalfStars />
                <span className="text-lg font-semibold">
                  {averageRating.toFixed(1)} ({reviews.length}{" "}
                  {reviews.length === 1 ? "review" : "reviews"})
                </span>
              </div>
            </CardContent>
          </Card>

          {user && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>
                  {userReview ? "Your Review" : "Write a Review"}
                </CardTitle>
                <CardDescription>
                  {userReview
                    ? "Edit your review below"
                    : "Share your thoughts about this book"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Rating</label>
                    <RatingInput
                      rating={rating}
                      onRatingChange={setRating}
                      size="lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="review" className="text-sm font-medium">
                      Review
                    </label>
                    <Textarea
                      id="review"
                      placeholder="Write your review here..."
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      rows={4}
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" disabled={submitting}>
                      {submitting
                        ? "Submitting..."
                        : userReview
                        ? "Update Review"
                        : "Submit Review"}
                    </Button>
                    {userReview && (
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => setShowDeleteDialog(true)}
                      >
                        Delete Review
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-primary">All Reviews</h2>
            {reviews.length === 0 ? (
              <p className="text-muted-foreground">
                No reviews yet. Be the first to review this book!
              </p>
            ) : (
              reviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  id={review.id}
                  rating={review.rating}
                  reviewText={review.review_text}
                  userName={review.userName || "Anonymous"}
                  createdAt={review.created_at}
                  isOwner={user?.id === review.user_id}
                  onEdit={() => {
                    setRating(review.rating);
                    setReviewText(review.review_text);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  onDelete={() => {
                    setUserReview(review);
                    setShowDeleteDialog(true);
                  }}
                />
              ))
            )}
          </div>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Review</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this review? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteReview}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
