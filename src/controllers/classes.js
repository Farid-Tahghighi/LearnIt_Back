import express from "express";
const router = express.Router();
import { Class, validateClass } from "../models/Class.js";
import { User } from "../models/User.js";
import { Subject } from "../models/Subject.js";
import auth from "../middlewares/auth.js";
import checkCategory from "../middlewares/checkCategory.js";
import checkMod from "../middlewares/isMod.js";
import checkTeacher from "../middlewares/isTeacher.js";
import asyncErr from "../middlewares/asyncErrorHandler.js";

router.get(
  "/",
  asyncErr(async (req, res) => {
    const classes = await Class.find();
    res.send(classes);
  })
);

router.get(
  "/:id",
  asyncErr(async (req, res) => {
    const clss = await Class.findById(req.params.id);
    if (!clss) {
      return res
        .status(400)
        .send("Class with id " + req.params.id + " doesn't exist");
    }
    res.send(clss);
  })
);

router.get(
  "/categories/:category",
  checkCategory,
  asyncErr(async (req, res) => {
    const classes = await Class.find({ category: req.params.category });
    res.send(classes);
  })
);

router.put(
  "/:Id",
  asyncErr(async (req, res) => {
    const { error } = validateClass(req.body);
    const subject = await Subject.findById(req.body.subjectId);
    if (!subject) return res.status(400).send("Invalid Subject.");
    const participants = await User.find({ _id: { $in: req.body.userIds } });
    if (!participants) return res.status(400).send("Invalid Participants.");
    const presenter = await User.findById(req.body.presenterId);
    if (!presenter) return res.status(400).send("Invalid Presenter.");
    const startTime = moment().format(req.body.startTime);
    const finishTime = moment().format(req.body.finishTime);
    if (error) return res.status(400).send(error.details[0].message);
    const clss = Class.findByIdAndUpdate(
      req.params.id,
      {
        subject: subject,
        participants: participants,
        presenter: presenter,
        plan: req.body.plan,
        startTime: startTime,
        finishTime: finishTime,
        location: req.body.location,
      },
      {
        new: true,
      }
    );
    if (!clss) return res.status(400).send("Invalid Class.");
    res.send(clss);
  })
);

router.post(
  "/",
  checkTeacher,
  asyncErr(async (req, res) => {
    const { error } = validateClass(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const subject = await Subject.findById(req.body.subjectId);
    if (!subject) return res.status(400).send("Invalid Subject.");
    let participants = new Array();
    for (let i = 0; i < req.body.participantIds.length; i++) {
      const participant = await User.findById(req.body.participantIds[0]);
      participants.push(participant);
    }
    if (!participants) return res.status(400).send("Invalid Participants.");
    const presenter = await User.findById(req.body.presenterId);
    if (!presenter) return res.status(400).send("Invalid Presenter.");
    const startTime = moment().format(req.body.startTime);
    const finishTime = moment().format(req.body.finishTime);
    let clss = new Class({
      subject: subject,
      participants: participants,
      presenter: presenter,
      plan: req.body.plan,
      startTime: startTime,
      finishTime: finishTime,
      location: req.body.location,
      category: req.body.category,
      description: req.body.description,
    });
    await clss.save();
    res.send(clss);
  })
);

router.delete(
  "/:id",
  [auth, checkMod],
  asyncErr(async (req, res) => {
    const clss = await Class.findByIdAndDelete(req.params.id);
    if (!clss) return res.status(400).send("Invalid Class.");
    res.send(clss);
  })
);

export default router;
