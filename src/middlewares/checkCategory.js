import categories from "../static/categories.js";

export default function (req, res, next) {
  let count;
  for (let i = 0; i < categories.length; i++) {
    if (req.params.category == categories[i].toLowerCase()) count++;
  }
  if (count == 0) return res.status(400).send("Category not found.");
  next();
}
