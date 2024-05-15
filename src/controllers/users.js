import express from "express";
const router = express.Router();
import { User, validateEditUser } from "../models/User.js";
import { Class } from "../models/Class.js";
import auth from "../middlewares/auth.js";
import asyncErr from "../middlewares/asyncErrorHandler.js";
import checkMod from "../middlewares/isMod.js";

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
  "/presenters",
  [auth, checkMod],
  asyncErr(async (req, res) => {
    const presenters = await User.find({ type: "Teacher" }).select(
      "email name"
    );
    if (!presenters) return res.status(400).send("No Presenters were found.");
    res.send(presenters);
  })
);

router.get(
  "/students",
  [auth, checkMod],
  asyncErr(async (req, res) => {
    const students = await User.find({
      $or: [{ type: "Student" }],
    }).select("email name");
    if (!students) return res.status(400).send("No students were find.");
    res.send(students);
  })
);

router.get(
  "/:id",
  asyncErr(async (req, res) => {
    let user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(400).send("User not found");
    res.send(user);
  })
);

router.put(
  "/:email",
  auth,
  asyncErr(async (req, res) => {
    const { error } = validateEditUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const targetUser = await User.findOne({ email: req.params.email });
    if (req.user.type != "Moderator") {
      req.body.type = targetUser.type;
    }
    let user = await User.findOneAndUpdate(
      { email: req.params.email },
      {
        name: req.body.name,
        gender: req.body.gender,
        age: req.body.age,
        type: req.body.type,
        email: req.body.email,
        description: req.body.description,
      },
      {
        new: true,
      }
    );
    if (!user) return res.status(400).send("Bad Request!");
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

router.get(
  "/",
  [auth, checkMod],
  asyncErr(async (req, res) => {
    const users = await User.find();
    if (!users) return res.status(400).send("Users not found.");
    return res.send(users);
  })
);

router.delete(
  "/:email",
  [auth, checkMod],
  asyncErr(async (req, res) => {
    const user = await User.findOneAndDelete({ email: req.params.email });
    if (!user) return res.status(400).send("User not found.");
    res.send(user);
  })
);

export default router;
