# 🛒 E-Commerce REST API

![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?logo=node.js\&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.x-000000?logo=express\&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb\&logoColor=white)
![License](https://img.shields.io/badge/License-ISC-blue)
![Status](https://img.shields.io/badge/Status-Production%20Ready-success)

A production-ready **RESTful E-Commerce API** built with **Node.js**, **Express.js 5**, and **MongoDB Atlas**.

This project demonstrates modern backend development practices including **JWT Authentication**, **Role-Based Authorization**, **Product Management**, **Reviews**, **Orders**, **Image Uploads**, **API Security**, and **Interactive API Documentation** using **Swagger UI**.

---

# 🌐 Live Demo

### 🚀 Live API

https://nodejs-ecommerce-api-xg1q.onrender.com

### 📖 Swagger Documentation

https://nodejs-ecommerce-api-xg1q.onrender.com/api-docs

---

# ✨ Features

## 🔐 Authentication & Authorization

* JWT Authentication
* HTTP-Only Cookie Authentication
* User Registration
* User Login
* Logout
* Role-Based Authorization (Admin/User)
* Protected Routes

---

## 👤 User Management

* View Current User
* Update User Profile
* Update Password
* Get Single User (Admin)
* Get All Users (Admin)

---

## 📦 Product Management

* Create Product
* Update Product
* Delete Product
* Get Single Product
* Get All Products
* Upload Product Images
* Product Image Validation

---

## ⭐ Review System

* Create Reviews
* Update Reviews
* Delete Reviews
* Get Product Reviews
* Prevent Duplicate Reviews
* Populate User Information
* Populate Product Information

---

## 🛒 Order Management

* Create Orders
* Get Current User Orders
* Get Single Order
* Get All Orders (Admin)
* Update Order Status

---

## 🗄️ Database Features

* MongoDB Aggregation Pipelines
* Mongoose Populate
* Mongoose Virtual Populate
* Mongoose Middleware
* Schema Validation
* Password Hashing with bcrypt
* Model Relationships

---

## 🛡️ Security

* Helmet Security Headers
* CORS
* Rate Limiting
* HTTP-Only Cookies
* JWT Verification
* Protected Routes
* Input Validation

---

## 📄 Documentation

* Interactive Swagger UI
* Organized REST Endpoints
* Built-in Request/Response Testing

---

# 🛠️ Tech Stack

## Backend

* Node.js
* Express.js 5

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

## File Uploads

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

## Clone the repository

```bash
git clone https://github.com/iamskyy666/nodejs-ecommerce.git
```

```bash
cd nodejs-ecommerce
```

---

## Install dependencies

```bash
npm install
```

---

## Create a `.env` file

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_super_secret_key

JWT_LIFETIME=1d

NODE_ENV=development
```

---

## Run the development server

```bash
npm run dev
```

---

## Run in production

```bash
npm start
```

---

# 📖 API Documentation

After starting the server locally, open:

```text
http://localhost:5000/api-docs
```

The interactive Swagger documentation allows you to:

* Explore all endpoints
* Test API requests
* View request bodies
* View response schemas
* Understand authentication requirements

---

# 🔐 Authentication

Protected endpoints require authentication.

After logging in successfully, the API stores a signed **HTTP-Only JWT Cookie**, which is automatically used for subsequent authenticated requests.

Role-based permissions ensure that administrative operations are restricted to authorized users.

---

# 🛡️ Security Features

* Password hashing using bcrypt
* JWT Authentication
* HTTP-Only Cookies
* Role-Based Authorization
* Helmet Security Headers
* CORS Protection
* Rate Limiting
* Input Validation
* Secure Cookie Support

---

# 📦 Key Dependencies

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
* validator
* morgan
* swagger-jsdoc
* swagger-ui-express

---

# 🚀 Future Improvements

* Stripe Payment Integration
* Email Verification
* Forgot/Reset Password
* Docker Support
* Unit & Integration Testing
* GitHub Actions CI/CD
* Redis Caching
* Search, Filtering & Pagination
* Order History Analytics

---

# 📷 Screenshots

Screenshots of the application, Swagger documentation, MongoDB Atlas collections, and Postman API testing will be added soon.

---

# 👨‍💻 Author

**Soumadip Banerjee**

Backend Developer • MERN Stack Developer

GitHub:

https://github.com/iamskyy666

---

# ⭐ Support

If you found this project useful, consider giving it a **⭐ Star** on GitHub.

It helps others discover the project and motivates future improvements.

---

# 📄 License

This project is licensed under the **ISC License**.
