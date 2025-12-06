# Philia - Social Media App Backend 🌐

Welcome to the backend of **Philia**, a modern social media platform designed to connect people seamlessly. This backend is built using **Spring Boot**, ensuring scalability, security, and performance.

---

## 🚀 Features

- **User Management**: Create, update, and manage user profiles.
- **Posts & Comments**: Share posts, like posts, add comments, and interact with others.
- **Search Functionality**: Search for content using keywords.
- **Robust Security**: Comprehensive security measures including authentication, authorization, and data validation.
- **Trending Content**: Discover trending posts.

---

## 🔒 Security Highlights

- **JWT Authentication**: Secure token-based authentication.
- **Authorization**: Fine-grained access control so that only authorized user can perform the operations.
- **Input Validation**: Prevents invalid and malicious data entry.
---

## 📖 API Documentation


### General Endpoints

#### `/api`
- **GET** `/search/{keyword}`: Search for content by keyword.

### User Endpoints 👤

#### `/users`
- **GET** `/`: Retrieve all users.
- **GET** `/profile/{id}`: Get user profile by ID.
- **GET** `/profile/{id}/image`: Get user profile image by ID.
- **GET** `/profile/{id}/posts`: Get posts by a specific user.
- **GET** `/{id}/comments`: Get comments made by a specific user.
- **GET** `/{id}/friends`: Get friends of a specific user.
- **GET** `/{id}/friends/suggestions`: Get friend suggestions for a specific user.
- **GET** `/auth/me`: Get details of the currently logged-in user.
- **GET** `/auth/pre-register/otp/send`: Send OTP to email for pre-registration.
- **POST** `/auth/login`: Log in a user.
- **POST** `/auth/register`: Register a new user.
- **PUT** `/`: Update user details.
- **PUT** `/profile/{id}/image`: Update user profile image.
- **POST** `/{userID}/friends/send/{friendId}`: Send a friend request.
- **PATCH** `/{userId}/friends/accept/{senderId}`: Accept a friend request.
- **DELETE** `/{userId}/friends/reject/{senderId}`: Reject a friend request.
- **DELETE** `/{userId}/friends/cancel/{receiverId}`: Cancel a sent friend request.
- **DELETE** `/{userId}/friends/remove/{friendId}`: Remove a friend.
- **DELETE** `/{id}`: Delete a user.
- **GET** `/{id}/notifications`: Get all notifications for a user.
- **POST** `/{userId}/notifications/read/all`: Mark all notifications as read for a user.
- **POST** `/{userId}/notifications/read/{notificationId}`: Mark a specific notification as read.
- **DELETE** `/{userId}/notifications/delete/{notificationId}`: Delete a specific notification.

### Post Endpoints 📝

#### `/posts`
- **GET** `/`: Retrieve all posts.
- **GET** `/{id}`: Get a specific post by ID.
- **GET** `/{postId}/comments`: Get comments for a specific post.
- **GET** `/{postId}/likes`: Get likes for a specific post.
- **GET** `/{postId}/image`: Get the image of a specific post.
- **GET** `/trending`: Retrieve trending posts.
- **POST** `/`: Create a new post.
- **PUT** `/`: Update an existing post.
- **POST** `/{postId}/likes/add/{userId}`: Like a specific post.
- **DELETE** `/{postId}/likes/remove/{userId}`: Remove a like from a specific post.
- **DELETE** `/{id}`: Delete a specific post.

### Comment Endpoints 💬

#### `/comments`
- **GET** `/{id}`: Retrieve a specific comment by ID.
- **GET** `/{commentId}/likes`: Get likes for a specific comment.
- **POST** `/`: Add a new comment to a post.
- **PUT** `/`: Update an existing comment.
- **POST** `/{commentId}/likes/add/{userId}`: Like a specific comment.
- **DELETE** `/{commentId}/likes/remove/{userId}`: Remove a like from a specific comment.
- **DELETE** `/{commentId}`: Delete a specific comment.

---

## 🛠️ Setup Instructions

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd philia-backend
   ```
3. Build the project:
   ```bash
   ./gradlew build
   ```
4. Run the application:
   ```bash
   ./gradlew bootRun
   ```

---

## 📂 Project Structure

- **`src/main/java`**: Contains the main application code.
- **`src/main/resources`**: Configuration files and templates.
- **`build/`**: Compiled files and reports.
---

## 🛠️ Tech Stack & Dependencies

### Tech Stack
- **Java 21**: The primary programming language.
- **Spring Boot 3.5.7**: Framework for building the backend application.
- **Hibernate**: ORM tool for database interactions.
- **MySQL Database**: MySQL database for storing data.
- **Gradle**: Build automation tool.

### Dependencies
- **Spring Web**: For building RESTful APIs.
- **Spring Security**: For authentication and authorization.
- **Spring Data JPA**: For database operations.
- **Spring Mail**: For sending emails.
- **Validation API**: For input validation.
- **Lombok**: To reduce boilerplate code.
- **JWT (io.jsonwebtoken)**: For secure token-based authentication.
- **Caffeine**: For caching the generated OTPs.

