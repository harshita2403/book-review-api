# Book Review API

A RESTful API for a Book Review system built with Node.js, Express, and MongoDB.

## Setup Instructions

### Prerequisites
- Node.js
- MongoDB

### Installation

1. Clone the repository
2. Install dependencies:
bash
npm install


3. Create a .env file in the root directory with the following:
PORT=5000
MONGO_URI=mongodb://localhost:27017/book-review-api
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d

4. Run the application:
bash
npm start


## API Endpoints

### Authentication
- POST /signup - Register a new user
- POST /login - User login

### Books
- POST /books - Add a new book (Auth required)
- GET /books - Get all books (with pagination and filters)
- GET /books/:id - Get a single book with reviews
- GET /search?query=keyword - Search books by title or author

### Reviews
- POST /books/:id/reviews - Submit a review (Auth required)
- PUT /reviews/:id - Update a review (Auth required)
- DELETE /reviews/:id - Delete a review (Auth required)

## Example API Requests

### Register a User
bash
curl -X POST -H "Content-Type: application/json" -d '{"name":"John Doe","email":"john@example.com","password":"123456"}' http://localhost:5000/signup


### Login
bash
curl -X POST -H "Content-Type: application/json" -d '{"email":"john@example.com","password":"123456"}' http://localhost:5000/login


### Create a Book (Auth required)
bash
curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_TOKEN" -d '{"title":"The Great Gatsby","author":"F. Scott Fitzgerald","genre":"Classic","description":"A story of wealth, love and the American Dream."}' http://localhost:5000/books


### Get All Books
bash
curl -X GET http://localhost:5000/books


### Search Books
bash
curl -X GET http://localhost:5000/books/search?query=gatsby


### Add a Review (Auth required)
bash
curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_TOKEN" -d '{"rating":5,"text":"Amazing book!"}' http://localhost:5000/books/BOOK_ID/reviews


## Database Schema

### User Schema
- name: String (required)
- email: String (required, unique)
- password: String (required, hashed)
- createdAt: Date

### Book Schema
- title: String (required)
- author: String (required)
- genre: String (required)
- description: String (required)
- user: ObjectId (reference to User)
- createdAt: Date

### Review Schema
- rating: Number (required, 1-5)
- text: String (required)
- book: ObjectId (reference to Book)
- user: ObjectId (reference to User)
- createdAt: Date