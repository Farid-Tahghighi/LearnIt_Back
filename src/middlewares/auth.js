import jwt from "jsonwebtoken";
import "dotenv/config";

function auth(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access Denied, no token provided.");
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (e) {
    res.status(400).send("Invalid Token.");
  }
}

export default auth;
