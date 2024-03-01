import express from "express";
const router = express.Router();
import { User, validateUser } from "../models/User.js";
import _ from "lodash";
import Joi from "joi";
import "dotenv/config";
import bcrypt from "bcrypt";
import jpc from "joi-password-complexity";
import asyncErr from "../middlewares/asyncErrorHandler.js";

const complexityOptions = {
  min: 4,
  max: 20,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
  requirementCount: 3,
};

const schema = Joi.object({
  password: jpc(complexityOptions),
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
    user = new User(
      _.pick(req.body, ["name", "age", "gender", "type", "password", "email"])
    );
    user.password = await bcrypt.hash(user.password, 10);
    await user.save();
    res.send(_.pick(user, ["name", "age", "email", "gender"]));
  })
);

export default router;
