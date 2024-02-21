import express from "express";
const router = express.Router();
import { User, validateUser } from "../models/User.js";
import _ from "lodash";
import auth from "../middlewares/auth.js";

router.get("/me", auth, async (req, res) => {
  const user = await User.findOne({ email: req.user.email }).select(
    "-password"
  );
  res.send(user);
});

router.get("/:id", async (req, res) => {
  let user = await User.findById(req.params.id);
  if (!user) return res.status(400).send("User not found");
  user = _.pick(user, ["name", "email", "age", "type", "description"]);
  res.send(user);
});

router.put("/:email", async (req, res) => {
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
  console.log(user);
  console.log(token);
  res.header("x-auth-token", token).send(user);
});

export default router;
