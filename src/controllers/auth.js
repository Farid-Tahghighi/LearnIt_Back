import express from "express";
const router = express.Router();
import { User, validateUser } from "../models/User.js";
import Joi from "joi";
import "dotenv/config";
import bcrypt from "bcrypt";
import asyncErr from "../middlewares/asyncErrorHandler.js";

const schema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().email().required(),
});

const validateAuth = (body) => {
  return schema.validate(body);
};

router.post(
  "/login",
  asyncErr(async (req, res) => {
    const { error } = validateAuth(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Incorrect email or password.");
    const pass = await bcrypt.compare(req.body.password, user.password);
    if (!pass) return res.status(400).send("Incorrect email or password.");
    const token = user.generateAuthToken();
    res.send(token);
  })
);

router.post(
  "/signup",
  asyncErr(async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("User already exists.");
    user = new User({
      name: req.body.name,
      age: req.body.age,
      type: "Student",
      gender: "Not Set",
      description: "",
      email: req.body.email,
      password: req.body.password,
    });
    user.password = await bcrypt.hash(user.password, 10);
    await user.save();
    res.send(user);
  })
);

export default router;
