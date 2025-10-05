import { useEffect, useState } from "react";
import { booksAPI } from "@/services/api";
import { BookCard } from "@/components/BookCard";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  published_year: number;
  reviews: { rating: number }[];
  averageRating?: number;
  displayRating?: number;
  reviewCount?: number;
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

const ITEMS_PER_PAGE = 5;

export default function BookList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchBooks();
  }, [currentPage]);

  const fetchBooks = async () => {
    try {
      setLoading(true);

      // Get paginated books from MongoDB API
      const response = await booksAPI.getAllBooks();

      console.log("API Response:", response); // Debug log

      if (!response.success) {
        throw new Error(response.message);
      }

      // Ensure books array exists
      if (!response.data || !Array.isArray(response.data.books)) {
        console.error("Invalid response structure:", response);
        throw new Error("Invalid response structure from server");
      }

      // Map backend data to frontend interface
      const mappedBooks = response.data.books.map((book: BackendBook) => {
        if (!book || !book._id) {
          console.error("Invalid book object:", book);
          throw new Error("Invalid book data received from server");
        }

        return {
          id: book._id,
          title: book.title,
          author: book.author,
          genre: book.genre,
          published_year: book.publishedYear,
          reviews: [], // Reviews are included in averageRating now
          averageRating: book.averageRating || 0,
          displayRating: book.displayRating || 0,
          reviewCount: book.reviewCount || 0,
        };
      });

      setBooks(mappedBooks);
      setTotalCount(response.data.pagination.total);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load books";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const calculateAverageRating = (book: Book) => {
    // Return displayRating from backend (rounded to 0.5 increments for stars)
    return book.displayRating || book.averageRating || 0;
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

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
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-primary mb-2">
              Discover Books
            </h1>
            <p className="text-muted-foreground">
              Browse and review your favorite books
            </p>
          </div>

          {books.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground">
                No books found. Be the first to add one!
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {books.map((book) => (
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

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
