# 🎓 Sell Course Project API

A RESTful API for an online course selling platform built with **Node.js**, **Express**, and **MongoDB**.

## 🌐 Live Demo

- [API Documentation](https://sellcourseproject.onrender.com/api-docs)

## 🚀 Features

- **User authentication**: Register, login, and logout
- **Role-based authorization**: Supports roles for admin, teacher, and student
- **Course management**: CRUD operations for courses
- **Lesson management**: Manage lessons within courses
- **Course enrollment system**: Enroll students in courses
- **Review and rating system**: Allow students to review courses
- **File uploads**: Handle images and videos using Cloudinary
- **API documentation**: Generated with Swagger

## 🛠 Technologies Used

- **Node.js**
- **Express.js**
- **MongoDB** with **Mongoose**
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Multer** & **Cloudinary** for file uploads
- **Joi** for data validation
- **Swagger** for API documentation
- **CORS** for cross-origin resource sharing

## 📖 Getting Started

### Prerequisites

- **Node.js** (v12 or higher)
- **MongoDB**
- **Cloudinary account**

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/phihung0131/Sell-Course-Project-API
    cd Sell-Course-Project-API
    ```
2. Install dependencies:
    ```sh
    npm install
    ```
3. Create a `.env` file in the root directory with the following variables:
    ```env
    PORT=3000
    HOSTNAME=localhost
    DB_URI=<your-mongodb-uri>
    DB_NAME=<your-db-name>
    DB_USER=<your-db-user>
    DB_PASS=<your-db-password>
    CLOUDINARY_CLOUD_NAME=<your-cloudinary-name>
    CLOUDINARY_API_KEY=<your-cloudinary-api-key>
    CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
    ```

### Running the Application

#### Development Mode

Start the application:
```sh
npm run dev
```
The API will be available at `http://localhost:3000`.

## 📜 API Documentation

Once the server is running, you can access the Swagger documentation at:

- **Local**: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
- **Production**: [https://sellcourseproject.onrender.com/api-docs](https://sellcourseproject.onrender.com/api-docs)

## 📚 Main Features

### Authentication

- Register new users (student/teacher)
- Login with username/password
- Logout and token invalidation

### Courses

- Create courses (teachers only)
- Update course details
- List all courses
- Search and filter courses
- View course details

### Lessons

- Add lessons to courses (teachers only)
- Update lesson content
- View lesson details (for enrolled students)

### Enrollments

- Enroll in courses (students)
- Approve enrollments (teachers)
- View enrolled courses

### Reviews

- Add course reviews (for enrolled students)
- View course reviews

## 📁 Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Request handlers
├── docs/           # API documentation
├── helper/         # Helper functions
├── middlewares/    # Express middlewares
├── models/         # Database models
├── routes/         # Route definitions
├── seeder/         # Database seeders
└── server.js       # Application entry point
```
