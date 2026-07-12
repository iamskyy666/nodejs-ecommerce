import "dotenv/config";
import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import fileUpload from "express-fileupload";
import swaggerUI from "swagger-ui-express";

import connectDB from "./db/connect.js";
import swaggerSpec from "./docs/swagger.js";

import notFound from "./middleware/not-found.js";
import errorHandlerMiddleware from "./middleware/error-handler.js";

import authRouter from "./routes/authRouter.js";
import userRouter from "./routes/userRouter.js";
import productRouter from "./routes/productRouter.js";
import reviewRouter from "./routes/reviewRouter.js";
import orderRouter from "./routes/orderRouter.js";

const app = express();

// ============================================================================
// Security Middlewares
// ============================================================================

app.use(helmet());

app.use(
  cors({
    origin: true, // Allow all origins for now
    credentials: true,
  }),
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Max 100 requests/IP
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// ============================================================================
// Express Middlewares
// ============================================================================

app.use(express.json());

app.use(
  fileUpload({
    createParentPath: true,
  }),
);

app.use(cookieParser(process.env.JWT_SECRET));

// ============================================================================
// Logging
// ============================================================================

app.use(morgan("tiny"));

// ============================================================================
// Static Files
// ============================================================================

app.use(express.static("./public"));

// ============================================================================
// Swagger Documentation
// ============================================================================

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

// ============================================================================
// Routes
// ============================================================================

app.get("/", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>E-Commerce REST API</title>

  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: "Segoe UI", Arial, sans-serif;
      background: linear-gradient(135deg, #0f172a, #1e293b);
      color: #f8fafc;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 30px;
    }

    .container {
      max-width: 850px;
      width: 100%;
      background: rgba(255,255,255,0.06);
      backdrop-filter: blur(10px);
      border-radius: 18px;
      padding: 40px;
      box-shadow: 0 15px 40px rgba(0,0,0,.35);
    }

    h1 {
      font-size: 2.8rem;
      margin-bottom: 10px;
    }

    p {
      line-height: 1.7;
      color: #d1d5db;
    }

    .badge {
      display: inline-block;
      margin: 20px 0;
      background: #22c55e;
      color: white;
      padding: 8px 16px;
      border-radius: 30px;
      font-weight: bold;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit,minmax(250px,1fr));
      gap: 20px;
      margin-top: 35px;
    }

    .card {
      background: rgba(255,255,255,.08);
      padding: 20px;
      border-radius: 12px;
    }

    .card h3 {
      margin-bottom: 10px;
      color: #60a5fa;
    }

    a.button {
      display: inline-block;
      margin-top: 12px;
      background: #2563eb;
      color: white;
      text-decoration: none;
      padding: 12px 20px;
      border-radius: 8px;
      transition: .3s;
      font-weight: 600;
    }

    a.button:hover {
      background: #1d4ed8;
    }

    footer {
      margin-top: 40px;
      border-top: 1px solid rgba(255,255,255,.15);
      padding-top: 20px;
      text-align: center;
      color: #cbd5e1;
      font-size: .95rem;
    }

    code {
      color: #38bdf8;
    }
  </style>
</head>

<body>

<div class="container">

<h1>🛒 E-Commerce REST API</h1>

<p>
Production-ready REST API built with
<strong>Node.js</strong>,
<strong>Express.js</strong>,
<strong>MongoDB</strong> and
<strong>Mongoose</strong>.
</p>

<div class="badge">
🟢 API Status: Online
</div>

<div class="grid">

<div class="card">
<h3>📄 API Documentation</h3>

<p>
Explore every endpoint using Swagger UI.
</p>

<a class="button" href="/api-docs" target="_blank">
Open Swagger Docs
</a>

</div>

<div class="card">

<h3>⚙️ Features</h3>

<ul style="margin-left:18px;line-height:1.8">
<li>JWT Authentication</li>
<li>Role-Based Authorization</li>
<li>Products</li>
<li>Reviews</li>
<li>Orders</li>
<li>Image Uploads</li>
<li>Swagger Documentation</li>
</ul>

</div>

<div class="card">

<h3>🧰 Tech Stack</h3>

<p>

Node.js<br>
Express.js<br>
MongoDB Atlas<br>
Mongoose<br>
JWT<br>
Swagger

</p>

</div>

<div class="card">

<h3>📦 Version</h3>

<p>

Version: <code>v1.0.0</code><br>
Environment: <code>${process.env.NODE_ENV || "development"}</code>

</p>

</div>

</div>

<footer>

Developed by <strong>Soumadip Banerjee</strong>

<br><br>

GitHub:
<a
style="color:#60a5fa"
href="https://github.com/YOUR_GITHUB_USERNAME"
target="_blank">
https://github.com/iamskyy666
</a>

</footer>

</div>

</body>
</html>
`);
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/orders", orderRouter);

// ============================================================================
// Error Handling
// ============================================================================

app.use(notFound);
app.use(errorHandlerMiddleware);

// ============================================================================
// Start Server
// ============================================================================

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);

    app.listen(PORT, () => {
      console.log(`🟢 MongoDB Connected`);
      console.log(`🔵 Server running on port ${PORT}`);
      console.log(`📄 API Docs: http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error("🔴 Failed to start server");
    console.error(error);
    process.exit(1);
  }
};

start();
