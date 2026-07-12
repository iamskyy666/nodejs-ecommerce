import "dotenv/config";
import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import connectDB from "./db/connect.js";
import notFound from "./middleware/not-found.js";
import errorHandlerMiddleware from "./middleware/error-handler.js";
import authRouter from "./routes/authRouter.js";
import userRouter from "./routes/userRouter.js";
import productRouter from "./routes/productRouter.js";
import fileUpload from "express-fileupload";
import reviewRouter from "./routes/reviewRouter.js";
import orderRouter from "./routes/orderRouter.js";

const app = express();

// express middlewares
app.use(express.json());

// others
app.use(morgan("tiny"));
app.use(cookieParser(process.env.JWT_SECRET));

// make PUBLIC folder static for image upload
app.use(express.static("./public")); // default image
app.use(fileUpload());

// routes
app.get("/", (req, res) => {
  res.send("ECommerce-API running... ✅");
  console.log("signedCookie:", req.signedCookies);
  console.log("cookies: ", req.cookies);
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/orders", orderRouter);

// custom middlewares
app.use(notFound); // 404 - always before errorHandlerMiddleware
app.use(errorHandlerMiddleware); // always after 404 (notFound)

const PORT = process.env.PORT || 5000;

// start server
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);

    app.listen(PORT, () => {
      console.log(`🔵 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
};

start();
