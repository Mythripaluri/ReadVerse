import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { booksAPI, reviewsAPI } from "@/services/api";
import { Navbar } from "@/components/Navbar";
import { BookCard } from "@/components/BookCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, BookOpen, Star } from "lucide-react";
import { toast } from "sonner";

interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  published_year: number;
  publishedYear?: number;
  reviews: { rating: number }[];
  averageRating?: number;
  displayRating?: number;
  reviewCount?: number;
}

interface Review {
  id: string;
  rating: number;
  review_text: string;
  reviewText?: string;
  created_at: string;
  createdAt?: string;
  book: {
    id: string;
    _id?: string;
    title: string;
    author: string;
  };
  books?: {
    id: string;
    title: string;
    author: string;
  };
}

interface BackendBook {
  _id: string;
  title: string;
  author: string;
  genre: string;
  publishedYear: number;
  averageRating?: number;
  displayRating?: number;
  reviewCount?: number;
}

interface BackendReview {
  _id: string;
  rating: number;
  reviewText: string;
  createdAt: string;
  book: {
    _id: string;
    title: string;
    author: string;
  };
}

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [myBooks, setMyBooks] = useState<Book[]>([]);
  const [myReviews, setMyReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<{
    name: string;
    email: string;
  } | null>(null);

  useEffect(() => {
    if (!user) {
      toast.error("Please sign in to view your profile");
      navigate("/auth");
      return;
    }

    fetchProfileData();
  }, [user, navigate]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);

      // Set profile from user context
      if (user) {
        setProfile({ name: user.name, email: user.email });
      }

      // Fetch user's books
      const booksResponse = await booksAPI.getUserBooks();
      if (booksResponse.success) {
        const mappedBooks = booksResponse.data.books.map(
          (book: BackendBook) => ({
            id: book._id,
            title: book.title,
            author: book.author,
            genre: book.genre,
            published_year: book.publishedYear,
            publishedYear: book.publishedYear,
            reviews: [],
            averageRating: book.averageRating || 0,
            displayRating: book.displayRating || 0,
            reviewCount: book.reviewCount || 0,
          })
        );
        setMyBooks(mappedBooks);
      }

      // Fetch user's reviews
      const reviewsResponse = await reviewsAPI.getUserReviews();
      if (reviewsResponse.success) {
        const mappedReviews = reviewsResponse.data.map(
          (review: BackendReview) => ({
            id: review._id,
            rating: review.rating,
            review_text: review.reviewText,
            reviewText: review.reviewText,
            created_at: review.createdAt,
            createdAt: review.createdAt,
            book: {
              id: review.book._id,
              _id: review.book._id,
              title: review.book.title,
              author: review.book.author,
            },
            books: {
              id: review.book._id,
              title: review.book.title,
              author: review.book.author,
            },
          })
        );
        setMyReviews(mappedReviews);
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load profile data";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const calculateAverageRating = (book: Book) => {
    return book.displayRating || book.averageRating || 0;
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

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Card className="mb-8 bg-gradient-to-br from-card to-card/80">
            <CardHeader>
              <CardTitle className="text-3xl">My Profile</CardTitle>
              <CardDescription className="text-lg">
                {profile?.name} • {profile?.email}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-8">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-accent" />
                  <span className="font-semibold">{myBooks.length}</span>
                  <span className="text-muted-foreground">Books Added</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-accent" />
                  <span className="font-semibold">{myReviews.length}</span>
                  <span className="text-muted-foreground">Reviews Written</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="books" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="books">My Books</TabsTrigger>
              <TabsTrigger value="reviews">My Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="books" className="mt-6">
              {myBooks.length === 0 ? (
                <p className="text-center text-muted-foreground py-12">
                  You haven't added any books yet.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myBooks.map((book) => (
                    <BookCard
                      key={book.id}
                      id={book.id}
                      title={book.title}
                      author={book.author}
                      genre={book.genre}
                      publishedYear={book.published_year}
                      averageRating={calculateAverageRating(book)}
                      reviewCount={book.reviewCount || 0}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              {myReviews.length === 0 ? (
                <p className="text-center text-muted-foreground py-12">
                  You haven't written any reviews yet.
                </p>
              ) : (
                <div className="space-y-4 max-w-2xl">
                  {myReviews.map((review) => (
                    <Card
                      key={review.id}
                      className="cursor-pointer hover:shadow-lg transition-all bg-gradient-to-br from-card to-card/80"
                      onClick={() => navigate(`/book/${review.books.id}`)}
                    >
                      <CardHeader>
                        <CardTitle className="text-lg">
                          {review.books.title}
                        </CardTitle>
                        <CardDescription>
                          by {review.books.author}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? "fill-accent text-accent"
                                  : "fill-none text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-sm text-foreground/80 line-clamp-2">
                          {review.review_text}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
