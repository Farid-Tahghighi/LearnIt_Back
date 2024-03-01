import express from "express";
const router = express.Router();
import { User, validateUser } from "../models/User.js";
import { Class } from "../models/Class.js";
import _ from "lodash";
import auth from "../middlewares/auth.js";
import asyncErr from "../middlewares/asyncErrorHandler.js";

router.get(
  "/me",
  auth,
  asyncErr(async (req, res) => {
    const user = await User.findOne({ email: req.user.email }).select(
      "-password"
    );
    res.send(user);
  })
);

router.get(
  "/:id",
  asyncErr(async (req, res) => {
    let user = await User.findById(req.params.id);
    if (!user) return res.status(400).send("User not found");
    user = _.pick(user, ["name", "email", "age", "type", "description"]);
    res.send(user);
  })
);

router.put(
  "/:email",
  asyncErr(async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let user = await User.findOneAndUpdate(
      { email: req.params.email },
      {
        name: req.body.name,
        gender: req.body.gender,
        age: req.body.age,
        email: req.body.email,
        description: req.body.description,
      },
      {
        new: true,
      }
    );
    if (!user) return res.status(400).send("Bad Request!!!!!!!!!!!!!!!!");
    const token = user.generateAuthToken();
    res.header("x-auth-token", token).send(user);
  })
);

router.get(
  "/classes/:id",
  auth,
  asyncErr(async (req, res) => {
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(400).send("Bad request.");
    } else return res.status(400).send("Bad request.");
    const classes = await Class.find({
      participants: { $elemMatch: { _id: req.params.id } },
    });
    res.send(classes);
  })
);

export default router;
