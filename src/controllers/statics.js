import express from "express";
const router = express.Router();
import categories from "../static/categories.js";

router.get("/categories", (req, res) => {
  res.send(categories);
});

export default router;
