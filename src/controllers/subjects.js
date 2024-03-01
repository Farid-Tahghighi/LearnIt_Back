import express from "express";
const router = express.Router();
import { Subject } from "../models/Subject.js";
import asyncErr from "../middlewares/asyncErrorHandler.js";

router.get(
  "/",
  asyncErr(async (req, res) => {
    const subjects = await Subject.find();
    res.send(subjects);
  })
);

router.post(
  "/",
  asyncErr(async (req, res) => {
    const subject = new Subject({
      title: req.body.title,
      credit: req.body.credit,
      resource: req.body.resource,
    });
    await subject.save();
    res.send(subject);
  })
);

export default router;
