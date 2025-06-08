# This is a Node.js + Express REST API that allows users to manage books and submit reviews. Authenticated users can add books and post one review per book. It supports features like pagination, filtering, average rating calculation, and search.


🚀 Project Setup Instructions

# 1. Clone the Repository
-   git clone https://github.com/your-username/book-review-api.git
-   cd book-review-api

# 2. Install Dependencies
    npm install

# 3. Configure Environment Variables
    Create a .env file in the root directory:

    PORT=4000
    MONGO_URI=mongodb://localhost:27017/book-review
    JWT_SECRET=your_jwt_secret_key

# 4. Start the Server
    npm run dev


## Features

- User registration and login with JWT authentication
- CRUD operations for books
- Add, update, and delete reviews for books
- Search and filter books
- Pagination for books and reviews


## API Endpoints

### User Authentication

- POST /users/signup
  Register a new user.

- POST /users/login 
  Login and receive a JWT token.


### Books

- POST /api/books
  Add a new book (requires authentication).

- GET /api/books
  Get all books (supports pagination and filtering).

- GET /api/books/search?query=...
  Search books by title or author.

- GET /api/books/:id
  Get a book by ID (with paginated reviews).


### Reviews

- POST /api/books/:id/reviews
  Add a review to a book (requires authentication).

- PUT /api/reviews/:id
  Update a review (requires authentication).

- DELETE /api/reviews/:id
  Delete a review (requires authentication).




## Example Requests & Responses

### Register User

**Request**
```http
POST /users/signup
Content-Type: application/json

{
  "fullName": { 
    "firstName": "John", 
    "lastName": "Doe" 
    },
  "email": "john@example.com",
  "password": "password123"
}
```

**Response**
```json
{
  "token": "<jwt_token>",
  "user": {
    "_id": "...",
    "fullName": { 
        "firstName": "John", 
        "lastName": "Doe" 
    },
    "email": "john@example.com"
  }
}
```

---

### Login User

**Request**
```http
POST /users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response**
```json
{
  "token": "<jwt_token>",
  "user": {
    "_id": "...",
    "fullName": { "firstName": "John", "lastName": "Doe" },
    "email": "john@example.com"
  }
}
```

---

### Add Book

**Request**
```http
POST /api/books
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Book Title",
  "author": "Author Name",
  "genre": "Fiction",
  "description": "A great book.",
  "publishYear": 2024
}
```

**Response**
```json
{
  "message": "Book created successfully",
  "book": {
    "_id": "...",
    "title": "Book Title",
    "author": "Author Name",
    "genre": "Fiction",
    "description": "A great book.",
    "publishYear": 2024,
    "reviews": []
  }
}
```

---


### Get All Books

**Request**
```http
GET /api/books?page=1&limit=10
```

**Response**
```json
{
  "total": 1,
  "page": 1,
  "limit": 10,
  "books": [
    {
      "_id": "...",
      "title": "Book Title",
      "author": "Author Name",
      "genre": "Fiction",
      "description": "A great book.",
      "publishYear": 2024,
      "reviews": []
    }
  ]
}
```

---

### Add Review

**Request**
```http
POST /api/books/<book_id>/reviews
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "rating": 5,
  "comment": "Excellent book!"
}
```

**Response**
```json
{
  "message": "Review submitted successfully",
  "review": {
    "_id": "...",
    "book": "<book_id>",
    "user": "<user_id>",
    "rating": 5,
    "comment": "Excellent book!"
  }
}
```

---


### Update Review

**Request**
```http
PUT /api/reviews/:id
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "rating": 4,
  "comment": "Changed my mind, it's great but not perfect."
}
```

**Response**
```json
{
  "message": "Review updated",
  "review": {
    "_id": "",
    "book": "",
    "user": "",
    "rating": 4,
    "comment": "Changed my mind, it's great but not perfect.",
    "createdAt": "2025-06-08T12:00:00.000Z",
    "updatedAt": "2025-06-08T12:10:00.000Z",
    "__v": 0
  }
}

```

---


### Delete Review

**Request**
```http
DELETE /api/reviews/:id
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Response**
```json

{
  "message": "Review deleted"
}


```

---


# Database Schema Design
# User

| Field      | Type     | Description               |
| ---------- | -------- | ------------------------- |
| `_id`      | ObjectId | Primary key               |
| `fullName` | Object   | `{ firstName, lastName }` |
| `email`    | String   | Unique, required          |
| `password` | String   | Hashed, required          |


# Book

| Field         | Type        | Description                    |
| ------------- | ----------- | ------------------------------ |
| `_id`         | ObjectId    | Primary key                    |
| `title`       | String      | Required                       |
| `author`      | String      | Required                       |
| `genre`       | String      | Required                       |
| `description` | String      | Optional                       |
| `publishYear` | Number      | Optional                       |
| `reviews`     | \[ObjectId] | References to Review documents |


# Review

| Field       | Type     | Description         |
| ----------- | -------- | ------------------- |
| `_id`       | ObjectId | Primary key         |
| `user`      | ObjectId | Reference to User   |
| `book`      | ObjectId | Reference to Book   |
| `rating`    | Number   | Required, range 1–5 |
| `comment`   | String   | Optional            |
| `createdAt` | Date     | Auto-generated      |
| `updatedAt` | Date     | Auto-generated      |



# Relationship

+-----------+       +------------+       +----------+
|   User    |       |    Book    |       |  Review  |
+-----------+       +------------+       +----------+
| _id (PK)  |<-------| _id (PK)   |<------| _id (PK) |
| fullName  |       | title      |       | user (FK)|
| email     |       | author     |       | book (FK)|
| password  |       | genre      |       | rating   |
+-----------+       | description|       | comment  |
    |               | publishYear|       | createdAt|
    | 1             | reviews (FK)|-------> updatedAt|
    |               +------------+       +----------+
    |                                        |
    |                                        M
    | M                                      |
    +----------------------------------------+
