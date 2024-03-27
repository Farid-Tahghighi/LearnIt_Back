import express from "express";
const router = express.Router();
import { Session, validateSession } from "../models/Session.js";
import asyncErr from "../middlewares/asyncErrorHandler.js";
import isTeacher from "../middlewares/isTeacher.js";
import auth from "../middlewares/auth.js";

router.get(
  "/:classId",
  asyncErr(async (req, res) => {
    const sessions = await Session.find();
    return res.send(sessions);
  })
);

router.get(
  "/session/:id",
  asyncErr(async (req, res) => {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(400).send("Session not found.");
    res.send(session);
  })
);

router.post(
  "/",
  [auth, isTeacher],
  asyncErr(async (req, res) => {
    const { error } = validateSession(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const session = new Session({
      classId: req.body.classId,
      duration: req.body.duration,
      present: req.body.present,
      date: req.body.date,
    });
    await session.save();
    res.send(session);
  })
);

export default router;
