import express from "express";
const router = express.Router();
import { User, validateUser } from "../models/User.js";
import _ from "lodash";
import bcrypt from "bcrypt";
import auth from "../middlewares/auth.js";

router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already exists.");
  user = new User(
    _.pick(req.body, ["name", "age", "gender", "type", "password", "email"])
  );
  user.password = await bcrypt.hash(user.password, 10);
  await user.save();
  const token = user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["name", "age", "email", "gender"]));
});

router.get("/me", auth, async (req, res) => {
  const user = await User.findOne({ email: req.user.email }).select("-password");
  console.log(user);
  res.send(user);
});

export default router;
