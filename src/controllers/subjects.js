import express from "express";
const router = express.Router();
import { Subject } from "../models/Subject.js";

router.post("/", async (req, res) => {
  const subject = new Subject({
    title: req.body.title,
    credit: req.body.credit,
    resource: req.body.resource,
  });
  await subject.save();
  res.send(subject);
});

export default router;
