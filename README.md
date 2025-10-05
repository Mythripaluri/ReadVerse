# 📚 Novel Narrate Nest - Book Review Platform

A full-stack MERN (MongoDB, Express.js, React, Node.js) application for book reviews and ratings with support for half-star ratings (0.5 increments).

## 🎯 Features

### ✅ Authentication System

- **User Registration & Login**: Custom JWT-based authentication
- **Password Security**: Bcrypt hashing with validation requirements
- **Protected Routes**: Middleware-based route protection
- **User Profiles**: View and manage user information

### ✅ Book Management

- **Add Books**: Create new book entries with details
- **Edit Books**: Update existing book information
- **Delete Books**: Remove books (author-only permission)
- **Search & Filter**: Find books by title, author, or genre
- **Pagination**: Efficient browsing of large book collections

### ✅ Review & Rating System

- **Half-Star Ratings**: Support for 0.5 increments (4.5 stars ⭐⭐⭐⭐💫)
- **Written Reviews**: Detailed text reviews with validation
- **Edit/Delete Reviews**: Manage your own reviews
- **Average Ratings**: Calculated and displayed for each book
- **Review History**: View all reviews by user

### ✅ Modern UI/UX

- **Responsive Design**: Mobile-first approach
- **Dark/Light Theme**: User preference support
- **Component Library**: Shadcn/ui components
- **Toast Notifications**: User feedback system
- **Loading States**: Smooth user experience

## 🛠️ Tech Stack

### Frontend

- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Shadcn/ui** component library
- **React Router** for navigation
- **Zustand/Context API** for state management

### Backend

- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Express Validator** for input validation
- **CORS** configured for development

### Database

- **MongoDB Atlas** (Cloud Database)
- **Mongoose Schemas** for data modeling
- **Indexing** for optimized queries

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or bun
- MongoDB Atlas account (or local MongoDB)

### 1. Clone Repository

```bash
git clone https://github.com/Mythripaluri/ReadVerse.git
cd ReadVerse
```

### 2. Backend Setup

```bash
cd backend
npm install

# Create .env file with:
echo "MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
NODE_ENV=development
PORT=5002
FRONTEND_URL=http://localhost:8080" > .env

# Start backend server
npm start
```

### 3. Frontend Setup

```bash
# In root directory
npm install

# Create .env file with:
echo "# Supabase variables removed - using MongoDB now
# Backend API URL for MERN stack
VITE_API_BASE_URL=http://localhost:5002/api" > .env

# Start frontend development server
npm run dev
```

### 4. Access Application

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:5002
- **API Documentation**: http://localhost:5002 (root endpoint)

## 📊 Database Schema

### Users Collection

```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (unique, required),
  password: String (hashed, required),
  createdAt: Date
}
```

### Books Collection

```javascript
{
  _id: ObjectId,
  title: String (required),
  author: String (required),
  description: String (required),
  genre: String (required),
  publishedYear: Number (required),
  addedBy: ObjectId (ref: User),
  averageRating: Number (0-5, 0.5 increments),
  reviewCount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Reviews Collection

```javascript
{
  _id: ObjectId,
  book: ObjectId (ref: Book),
  user: ObjectId (ref: User),
  rating: Number (0.5-5, 0.5 increments),
  reviewText: String (required),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 API Endpoints

### Authentication

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)

### Books

- `GET /api/books` - Get all books (with pagination/search)
- `GET /api/books/:id` - Get single book
- `POST /api/books` - Create book (protected)
- `PUT /api/books/:id` - Update book (protected)
- `DELETE /api/books/:id` - Delete book (protected)
- `GET /api/books/:id/reviews` - Get book reviews

### Reviews

- `POST /api/reviews` - Create review (protected)
- `PUT /api/reviews/:id` - Update review (protected)
- `DELETE /api/reviews/:id` - Delete review (protected)
- `GET /api/reviews/user/me` - Get user's reviews (protected)

## 📝 Password Requirements

When creating an account, passwords must contain:

- ✅ At least 6 characters
- ✅ One uppercase letter
- ✅ One lowercase letter
- ✅ One number

**Example**: `Password123`

## ⭐ Half-Star Rating System

The application supports precise ratings with 0.5 increments:

- ⭐ (1.0) to ⭐⭐⭐⭐⭐ (5.0)
- Half-stars: 1.5, 2.5, 3.5, 4.5 ⭐⭐💫
- Interactive rating input with visual feedback
- Precise average calculations displayed

## 🔧 Development

### Available Scripts

**Frontend**:

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

**Backend**:

- `npm start` - Start production server
- `npm run dev` - Start with nodemon (development)

### Environment Variables

**Frontend (.env)**:

```env
VITE_API_BASE_URL=http://localhost:5002/api
```

**Backend (.env)**:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bookreviews
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=30d
NODE_ENV=development
PORT=5002
FRONTEND_URL=http://localhost:8080
```

## 🚀 Deployment Ready

The application is production-ready with:

- ✅ Environment configuration
- ✅ Error handling and validation
- ✅ Security middleware (Helmet, CORS, Rate limiting)
- ✅ Optimized database queries
- ✅ Responsive UI components
- ✅ TypeScript support

## 📦 Project Structure

```
ReadVerse/
├── backend/                 # Express.js API server
│   ├── controllers/         # Route controllers
│   ├── middleware/          # Auth & validation middleware
│   ├── models/              # Mongoose schemas
│   ├── routes/              # API routes
│   ├── config/              # Database configuration
│   └── server.js            # Server entry point
├── src/                     # React frontend
│   ├── components/          # Reusable UI components
│   ├── pages/               # Page components
│   ├── contexts/            # React contexts
│   ├── services/            # API service layer
│   ├── lib/                 # Utilities
│   └── hooks/               # Custom React hooks
├── public/                  # Static assets
└── package.json             # Frontend dependencies
```

## 👤 Author

**Mythri Paluri**

- GitHub: [@Mythripaluri](https://github.com/Mythripaluri)

## 📄 License

This project is licensed under the MIT License.

---

**🎉 Ready for Submission!** This is a complete, production-ready MERN stack application with modern features and best practices.
