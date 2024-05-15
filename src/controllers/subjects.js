import express from "express";
const router = express.Router();
import { Subject, validateSubject } from "../models/Subject.js";
import asyncErr from "../middlewares/asyncErrorHandler.js";
import auth from "../middlewares/auth.js";
import checkMod from "../middlewares/isMod.js";

router.get(
  "/",
  asyncErr(async (req, res) => {
    const subjects = await Subject.find();
    res.send(subjects);
  })
);

router.get(
  "/:title",
  asyncErr(async (req, res) => {
    const subject = await Subject.findOne({ title: req.params.title });
    if (!subject) return res.status(400).send("Subject not found.");
    res.send(subject);
  })
);

router.post(
  "/",
  asyncErr(async (req, res) => {
    const { error } = validateSubject(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let subject = await Subject.findOne({ title: req.body.title });
    if (!subject) {
      subject = new Subject({
        title: req.body.title,
        credit: req.body.credit,
        resource: req.body.resource,
      });
      await subject.save();
      res.send(subject);
    } else return res.status(400).send("Subject already exists.");
  })
);

router.put(
  "/:title",
  [auth, checkMod],
  asyncErr(async (req, res) => {
    const { error } = validateSubject(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let subject = await Subject.findOneAndUpdate(
      { title: req.params.title },
      {
        title: req.body.title,
        credit: req.body.credit,
        resource: req.body.resource,
      },
      { new: true }
    );
    if (!subject) return res.status(400).send("Subject not found.");
    res.send(subject);
  })
);

router.delete(
  "/:title",
  [auth, checkMod],
  asyncErr(async (req, res) => {
    const subject = await Subject.findOneAndDelete({ title: req.params.title });
    if (!subject) return res.status(400).send("Subject not found.");
    res.send(subject);
  })
);

export default router;
