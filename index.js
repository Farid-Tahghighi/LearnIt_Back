import express from "express";
import mongoose from "mongoose";
const app = express();
import classes from "./src/controllers/classes.js";
import users from "./src/controllers/users.js";
import subjects from "./src/controllers/subjects.js";
import statics from "./src/controllers/statics.js";
import "dotenv/config";
import auth from "./src/controllers/auth.js";
import cors from "cors";

if (!process.env.JWT_SECRET_KEY) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined!");
  process.exit(1);
}

mongoose
  .connect("mongodb://0.0.0.0:27017/CFT")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.log("Error ", err));

const corsOptions = {
  exposedHeaders: "x-auth-token",
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/api/classes", classes);
app.use("/api/users", users);
app.use("/api/subjects", subjects);
app.use("/api/auth", auth);
app.use("/statics", statics);

const port = process.env.PORT;
app.listen(port, () => {
  console.log("Listening on port " + port + "...");
});
