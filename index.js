import express from "express";
import mongoose from "mongoose";
const app = express();
import classes from "./src/controllers/classes.js";
import users from "./src/controllers/users.js";
import subjects from "./src/controllers/subjects.js";
import statics from "./src/controllers/statics.js";
import sessions from "./src/controllers/sessions.js";
import "dotenv/config";
import auth from "./src/controllers/auth.js";
import cors from "cors";
import error from "./src/middlewares/error.js";

if (!process.env.JWT_SECRET_KEY) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined!");
  process.exit(1);
}

const port = process.env.PORT;
mongoose
  .connect(process.env.MONGO_DEV_URI)
  .then(() => {
    console.log("Connected to MongoDB...");
    app.listen(port);
    console.log(`Listening on port ${port}...`);
  })
  .catch((err) => {
    console.log("Error ", err);
    process.exit(1);
  });

const corsOptions = {
  exposedHeaders: "x-auth-token",
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/api/classes", classes);
app.use("/api/users", users);
app.use("/api/subjects", subjects);
app.use("/api/sessions", sessions);
app.use("/api/auth", auth);
app.use("/statics", statics);
app.use(error);
