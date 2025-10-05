import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { booksAPI } from "@/services/api";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";
import { z } from "zod";

const bookSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  author: z
    .string()
    .trim()
    .min(1, "Author is required")
    .max(100, "Author must be less than 100 characters"),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description must be less than 2000 characters"),
  genre: z
    .string()
    .trim()
    .min(1, "Genre is required")
    .max(50, "Genre must be less than 50 characters"),
  publishedYear: z
    .number()
    .min(1000, "Invalid year")
    .max(new Date().getFullYear() + 1, "Year cannot be in the future"),
});

export default function AddEditBook() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [publishedYear, setPublishedYear] = useState("");

  const isEditMode = Boolean(id);

  useEffect(() => {
    if (!user) {
      toast.error("Please sign in to add or edit books");
      navigate("/auth");
      return;
    }

    if (isEditMode) {
      fetchBook();
    }
  }, [id, user, navigate]);

  const fetchBook = async () => {
    try {
      setFetching(true);
      const response = await booksAPI.getBook(id!);

      if (!response.success) {
        throw new Error(response.message);
      }

      const book = response.data;
      if (book.addedBy._id !== user?.id && book.addedBy !== user?.id) {
        toast.error("You can only edit your own books");
        navigate("/");
        return;
      }

      setTitle(book.title);
      setAuthor(book.author);
      setDescription(book.description);
      setGenre(book.genre);
      setPublishedYear(book.publishedYear.toString());
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load book";
      toast.error(errorMessage);
      navigate("/");
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please sign in to continue");
      navigate("/auth");
      return;
    }

    try {
      const validated = bookSchema.parse({
        title,
        author,
        description,
        genre,
        publishedYear: parseInt(publishedYear),
      });

      setLoading(true);

      if (isEditMode) {
        const response = await booksAPI.updateBook(id!, {
          title: validated.title,
          author: validated.author,
          description: validated.description,
          genre: validated.genre,
          publishedYear: validated.publishedYear,
        });

        if (!response.success) {
          throw new Error(response.message);
        }

        toast.success("Book updated successfully!");
        navigate(`/book/${id}`);
      } else {
        const response = await booksAPI.createBook({
          title: validated.title,
          author: validated.author,
          description: validated.description,
          genre: validated.genre,
          publishedYear: validated.publishedYear,
        });

        console.log("Create book response:", response);

        if (!response.success) {
          throw new Error(response.message);
        }

        toast.success("Book added successfully!");
        console.log("Create book response:", response);
        
        // Navigate to home page after successful creation
        navigate("/");
      }
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to save book");
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
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
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <Button
            variant="ghost"
            onClick={() => navigate(isEditMode ? `/book/${id}` : "/")}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">
                {isEditMode ? "Edit Book" : "Add New Book"}
              </CardTitle>
              <CardDescription>
                {isEditMode
                  ? "Update the book information below"
                  : "Fill in the details to add a new book"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="Enter book title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="author">Author *</Label>
                  <Input
                    id="author"
                    type="text"
                    placeholder="Enter author name"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter book description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={5}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="genre">Genre *</Label>
                    <Input
                      id="genre"
                      type="text"
                      placeholder="e.g., Fiction, Mystery"
                      value={genre}
                      onChange={(e) => setGenre(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="year">Published Year *</Label>
                    <Input
                      id="year"
                      type="number"
                      placeholder="e.g., 2024"
                      value={publishedYear}
                      onChange={(e) => setPublishedYear(e.target.value)}
                      required
                      min="1000"
                      max={new Date().getFullYear() + 1}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading
                    ? "Saving..."
                    : isEditMode
                    ? "Update Book"
                    : "Add Book"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
