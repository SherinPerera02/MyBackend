import bodyParser from "body-parser";
import express from "express";
import mongoose from "mongoose";
import productRouter from "./routes/productRouter.js";
import userRouter from "./routes/userRouter.js";
import orderRouter from "./routes/orderRouter.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  const tokenString = req.header("Authorization");
  if (tokenString != null) {
    const token = tokenString.replace("Bearer ", "");

    jwt.verify(token, "password@123#", (err, decoded) => {
      if (decoded != null) {
        console.log(decoded);
        req.user = decoded;
        next();
      } else {
        console.log("Token is not provided");
        res.status(403).json({
          message: "Token is not provided",
        });
      }
    });
  } else {
    next();
  }
});

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("MongoDB is connected");
  })
  .catch(() => {
    console.log("MongoDB is not connected");
  });

app.use("/products", productRouter);
app.use("/users", userRouter);
app.use("/orders", orderRouter);

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
