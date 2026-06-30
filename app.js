import "dotenv/config";
import express from "express";
import connectDB from "./db/connect.js";

const app = express();

app.get("/", (_, res) => {
  res.send("ECommerce API running... ✅");
});

const PORT = process.env.PORT || 5000;

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