![Philia - Social Media App](./philia-frontend/src/assets/philia-dark-logo.png)

# Philia - Social Media App

> A modern, full-stack social media platform with AI-powered features built with React, TypeScript, and Spring Boot.

[![React](https://img.shields.io/badge/React-19.1.1-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4.1-blue?logo=tailwindcss)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-7.1-blue?logo=vite)](https://vitejs.dev/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.7-green?logo=springboot)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-21-blue?logo=java)](https://www.java.com/)
[![Gradle](https://img.shields.io/badge/Gradle-8.5-blue?logo=gradle)](https://gradle.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue?logo=mysql)](https://www.mysql.com/)
[![Hibernate](https://img.shields.io/badge/Hibernate-6.2-orange?logo=hibernate)](https://hibernate.org/)
[![Spring AI](https://img.shields.io/badge/Spring%20AI-LLM-blueviolet)](https://spring.io/projects/spring-ai)

## ✨ Features

- 🔐 **Authentication** - Secure login/registration with OTP verification
- 📝 **Posts** - Create, edit, delete posts with images
- ❤️ **Interactions** - Like, comment, and engage with content
- 👥 **Friends** - Send/receive friend requests and manage friendships
- 🔍 **Search** - Search users and posts with filters
- 🔔 **Notifications** - Real-time notifications for all activities
- 📈 **Trending** - Discover trending posts and popular content
- 👤 **Profiles** - View and edit user profiles
- 🎨 **Dark Theme** - Beautiful modern dark UI with glass-morphism effects
- 🤖 **AI-Powered Enhancement** - AI-driven caption and comment enhancement with multiple tone selection (Casual, Formal, Funny, etc.)

## 🛠️ Tech Stack (Frontend)

- **React 19.1** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Redux Toolkit** - State management
- **React Query** - Server state management
- **React Router** - Routing
- **Axios** - HTTP client
- **Framer Motion** - Animations
- **React Hook Form + Zod** - Form validation

## 🚀 Getting Started

### Prerequisites
- Node.js v16+
- npm or yarn

### Installation

```bash
# Clone repository
git clone https://github.com/Mainakcris7/philia.git

cd philia-frontend

# Install dependencies
npm install

# Configure API endpoint
# Update src/shared/config/appconfig.ts with your backend URL (if needed)

# Start dev server
npm run dev
```

The app runs on `http://localhost:5173`

## 📜 Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 📁 Project Structure

```
src/
├── components/      # Reusable components (cards, loaders, modals)
├── pages/          # Page components (Home, Profile, Search, etc.)
├── redux/          # State management (slices, store, selectors)
├── shared/         # Shared utilities
│   ├── services/   # API service functions
│   ├── types/      # TypeScript type definitions
│   ├── config/     # App configuration
│   └── utils/      # Utility functions
├── routes/         # Route configuration
├── schema/         # Form validation schemas
└── assets/         # Static assets
```

## 📦 Core Services

- **Auth** - Login, register, OTP verification, JWT management
- **Posts** - CRUD operations, likes, and interactions
- **Users** - Profiles, friend requests, friend suggestions
- **Comments** - Create, update, delete comments
- **Notifications** - Fetch and manage notifications
- **Search** - Search users and posts

## 🔌 API Configuration

Update the backend URL in `src/shared/config/appconfig.ts`:

```typescript
export const APP_CONFIG = {
  API_URL: "http://localhost:8080", // Your Spring Boot backend
};
```

---

## Backend Documentation 🌐

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
- **GET** `/ai/enhance-content`: Enhance content (caption, comment) using AI with specified tone.

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
   git clone https://github.com/Mainakcris7/philia.git
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
- **Spring AI 1.1.2**: LLM integration for AI-powered content enhancement.
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

## Author

- **Name:** `Mainakcris7`
- **GitHub:** [https://github.com/Mainakcris7](https://github.com/Mainakcris7)
- **Email:** mainakcr72002@gmail.com

## Contact
For any inquiries or support, please reach out via email at mainakcr72002@gmail.com