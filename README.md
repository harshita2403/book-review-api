# Book Review API

A RESTful API for a Book Review system built with Node.js, Express, and SQLite.

## Technology Stack

- *Node.js* with *Express.js* for the server framework
- *SQLite* as the database
- *Sequelize ORM* for database interactions
- *JWT* for authentication

## Setup Instructions

### Prerequisites
- Node.js (v12 or higher)

### Installation

1. Clone the repository
   
   git clone https://github.com/YOUR_USERNAME/book-review-api.git
   cd book-review-api
   

2. Install dependencies
   
   npm install
   

3. Create a .env file in the root directory with the following content:
   
   PORT=5000
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=30d
   

4. Start the application
   
   npm start
   

## API Endpoints

### Authentication
- POST /signup - Register a new user
- POST /login - User login (returns JWT token)

### Books
- POST /books - Add a new book (Auth required)
- GET /books - Get all books (with pagination and filters)
- GET /books/:id - Get a single book with reviews
- GET /books/search?query=keyword - Search books by title or author

### Reviews
- POST /books/:id/reviews - Submit a review (Auth required, one review per user per book)
- PUT /reviews/:id - Update your own review (Auth required)
- DELETE /reviews/:id - Delete your own review (Auth required)

## Sample API Requests

### Register a User
bash
curl -X POST http://localhost:5000/signup -H "Content-Type: application/json" -d "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"password123\"}"


### Login
bash
curl -X POST http://localhost:5000/login -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\",\"password\":\"password123\"}"


### Create a Book (Auth required)
bash
curl -X POST http://localhost:5000/books -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_TOKEN" -d "{\"title\":\"The Great Gatsby\",\"author\":\"F. Scott Fitzgerald\",\"genre\":\"Classic\",\"description\":\"A story of wealth, love and the American Dream.\"}"


### Get All Books
bash
curl -X GET http://localhost:5000/books


### Search Books
bash
curl -X GET "http://localhost:5000/books/search?query=gatsby"


### Add a Review (Auth required)
bash
curl -X POST http://localhost:5000/books/BOOK_ID/reviews -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_TOKEN" -d "{\"rating\":5,\"text\":\"Amazing book!\"}"


### Update a Review (Auth required)
bash
curl -X PUT http://localhost:5000/reviews/REVIEW_ID -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_TOKEN" -d "{\"rating\":4,\"text\":\"Updated review text\"}"


### Delete a Review (Auth required)
bash
curl -X DELETE http://localhost:5000/reviews/REVIEW_ID -H "Authorization: Bearer YOUR_TOKEN"


## Database Schema

### User Model
- id: Integer (primary key)
- name: String (required)
- email: String (required, unique)
- password: String (required, hashed)
- createdAt: Date

### Book Model
- id: Integer (primary key)
- title: String (required)
- author: String (required)
- genre: String (required)
- description: Text (required)
- userId: Integer (foreign key to User)
- averageRating: Float (default: 0)
- createdAt: Date

### Review Model
- id: Integer (primary key)
- rating: Integer (required, 1-5)
- text: Text (required)
- bookId: Integer (foreign key to Book)
- userId: Integer (foreign key to User)
- createdAt: Date

## Design Decisions

- Used SQLite for simplicity and portability (no external database service required)
- Implemented JWT for stateless authentication
- Structured the API with modular routes, controllers, and models for maintainability
- Added review constraints to ensure one review per user per book
- Included search functionality with case-insensitive partial matching
- Implemented proper error handling throughout the API
