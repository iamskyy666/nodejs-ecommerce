import "dotenv/config";
import express from "express";
import morgan from "morgan";
import connectDB from "./db/connect.js";
import notFound from "./middleware/not-found.js";
import errorHandlerMiddleware from "./middleware/error-handler.js";

const app = express();

// express middlewares
app.use(express.json());

// others
app.use(morgan("tiny"));

app.get("/", (_, res) => {
  res.send("ECommerce-API running... ✅");
});

// custom middlewares
app.use(notFound); // 404 - always before errorHandlerMiddleware
app.use(errorHandlerMiddleware); // always after 404 (notFound)

const PORT = process.env.PORT || 5000;

// start server
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} ✅`);
    });
  } catch (error) {
    console.error(error);
  }
};

start();
