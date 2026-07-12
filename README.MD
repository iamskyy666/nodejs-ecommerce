# 🛒 E-Commerce REST API

A production-ready RESTful E-Commerce API built with **Node.js**, **Express.js**, and **MongoDB**.

This project demonstrates authentication, authorization, product management, reviews, orders, image uploads, API security, and interactive API documentation using Swagger.

---

## 🚀 Features

### Authentication & Authorization

* JWT Authentication
* HTTP-Only Cookie Authentication
* User Registration & Login
* Logout Functionality
* Role-based Authorization (Admin/User)

### User Management

* View Current User
* Update User Profile
* Update Password
* Get Single User
* Get All Users (Admin)

### Product Management

* Create Product
* Update Product
* Delete Product
* Get Single Product
* Get All Products
* Product Image Upload

### Review System

* Create Review
* Update Review
* Delete Review
* Get Product Reviews
* Prevent Duplicate Reviews
* Populate User & Product Details

### Order Management

* Create Order
* Get Current User Orders
* Get Single Order
* Get All Orders (Admin)
* Update Order Status

### Database Features

* MongoDB Aggregation Pipelines
* Mongoose Populate
* Mongoose Virtuals
* Schema Validation
* Middleware Hooks
* Password Hashing with bcrypt

### Security

* Helmet
* CORS
* Rate Limiting
* HTTP-Only Cookies
* JWT Verification
* Protected Routes

### Documentation

* Interactive Swagger API Documentation

---

# 🛠️ Tech Stack

## Backend

* Node.js
* Express.js

## Database

* MongoDB Atlas
* Mongoose

## Authentication

* JSON Web Tokens (JWT)
* bcrypt

## Security

* Helmet
* express-rate-limit
* cookie-parser
* CORS

## File Upload

* express-fileupload

## Documentation

* Swagger UI
* swagger-jsdoc

## Logging

* Morgan

---

# 📂 Project Structure

```text
ecommerce-api/
│
├── controllers/
├── db/
├── docs/
├── errors/
├── middleware/
├── models/
├── public/
│   └── uploads/
├── routes/
├── utils/
│
├── app.js
├── package.json
├── .env
├── .gitignore
└── README.md
```

---

# ⚙️ Installation

Clone the repository

```bash
git clone https://github.com/<your-username>/nodejs-ecommerce.git
```

Move into the project

```bash
cd nodejs-ecommerce
```

Install dependencies

```bash
npm install
```

Create a `.env` file

```env
PORT=5000

MONGO_URI=<your_mongodb_connection_string>

JWT_SECRET=<your_secret_key>

JWT_LIFETIME=1d

NODE_ENV=development
```

Run the development server

```bash
npm run dev
```

Production

```bash
npm start
```

---

# 📖 API Documentation

Swagger UI is available at

```
http://localhost:5000/api-docs
```

The documentation provides:

* Request Parameters
* Request Body
* Response Codes
* Interactive Testing
* Endpoint Descriptions

---

# 📌 API Modules

## Authentication

* Register User
* Login User
* Logout User

## Users

* Show Current User
* Update Profile
* Update Password
* Get User
* Get All Users

## Products

* Get Products
* Get Product
* Create Product
* Update Product
* Delete Product
* Upload Product Image

## Reviews

* Create Review
* Update Review
* Delete Review
* Get Reviews
* Get Product Reviews

## Orders

* Create Order
* Get Order
* Get User Orders
* Get All Orders
* Update Order

---

# 🔐 Security

The API includes multiple security layers:

* Password hashing using bcrypt
* JWT Authentication
* HTTP-Only Cookies
* Protected Routes
* Role-based Access Control
* Rate Limiting
* Helmet Security Headers
* Input Validation

---

# 📦 Packages Used

* express
* mongoose
* bcrypt
* jsonwebtoken
* cookie-parser
* dotenv
* helmet
* cors
* express-rate-limit
* express-fileupload
* morgan
* validator
* swagger-jsdoc
* swagger-ui-express

---

# 📷 Screenshots

You can add screenshots here.

## Swagger UI

![Swagger](images/swagger.png)

## Postman Collection

![Postman](images/postman.png)

## MongoDB Atlas

![MongoDB](images/mongodb.png)

---

# 👨‍💻 Author

**Soumadip Banerjee**

Backend Developer | MERN Stack Developer

GitHub:
https://github.com/iamskyy666

---

# 📄 License

This project is licensed under the ISC License.
