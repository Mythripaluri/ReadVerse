// API service to communicate with Node.js backend
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5002/api";

// Helper function to get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem("token");
};

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();

  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  }

  const config = {
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
};

// Authentication API
export const authAPI = {
  // Sign up new user
  signUp: async (userData) => {
    const response = await apiRequest("/auth/signup", {
      method: "POST",
      body: JSON.stringify(userData),
    });

    if (response.success && response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data));
    }

    return response;
  },

  // Sign in user
  signIn: async (credentials) => {
    const response = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    if (response.success && response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data));
    }

    return response;
  },

  // Get user profile
  getProfile: async () => {
    return await apiRequest("/auth/profile");
  },

  // Sign out user
  signOut: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!getAuthToken();
  },
};

// Books API
export const booksAPI = {
  // Get all books with pagination and filters
  getBooks: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/books?${queryString}` : "/books";
    return await apiRequest(endpoint);
  },

  // Alias for getBooks (for backward compatibility)
  getAllBooks: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/books?${queryString}` : "/books";
    return await apiRequest(endpoint);
  },

  // Get single book by ID
  getBook: async (id) => {
    return await apiRequest(`/books/${id}`);
  },

  // Create new book
  createBook: async (bookData) => {
    return await apiRequest("/books", {
      method: "POST",
      body: JSON.stringify(bookData),
    });
  },

  // Update existing book
  updateBook: async (id, bookData) => {
    return await apiRequest(`/books/${id}`, {
      method: "PUT",
      body: JSON.stringify(bookData),
    });
  },

  // Delete book
  deleteBook: async (id) => {
    return await apiRequest(`/books/${id}`, {
      method: "DELETE",
    });
  },

  // Get reviews for a book
  getBookReviews: async (bookId) => {
    return await apiRequest(`/books/${bookId}/reviews`);
  },

  // Get current user's books
  getUserBooks: async () => {
    return await apiRequest("/books/user/me");
  },
};

// Reviews API
export const reviewsAPI = {
  // Create new review
  createReview: async (reviewData) => {
    return await apiRequest("/reviews", {
      method: "POST",
      body: JSON.stringify(reviewData),
    });
  },

  // Update existing review
  updateReview: async (id, reviewData) => {
    return await apiRequest(`/reviews/${id}`, {
      method: "PUT",
      body: JSON.stringify(reviewData),
    });
  },

  // Delete review
  deleteReview: async (id) => {
    return await apiRequest(`/reviews/${id}`, {
      method: "DELETE",
    });
  },

  // Get current user's reviews
  getUserReviews: async () => {
    return await apiRequest("/reviews/user/me");
  },
};

// Default export for general API utility
export default {
  authAPI,
  booksAPI,
  reviewsAPI,
  getAuthToken,
  apiRequest,
};
