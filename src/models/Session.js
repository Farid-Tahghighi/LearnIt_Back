import mongoose from "mongoose";
import { userSchema } from "./User.js";
import Joi from "joi";
import joiObjectid from "joi-objectid";
Joi.objectId = joiObjectid(Joi);

const sessionSchema = new mongoose.Schema({
  classId: { type: mongoose.Types.ObjectId, required: true },
  duration: { type: Number, required: true, min: 45, max: 180 },
  present: [{ type: userSchema }],
  date: { type: Date, required: true },
});

const schema = Joi.object({
  classId: Joi.objectId().required(),
  duration: Joi.number().max(180).required(),
  present: Joi.array().items(Joi.objectId()).required(),
  date: Joi.date().required(),
});

const validateSession = async (v) => {
  return await schema.validateAsync(v);
};

const Session = mongoose.model("Session", sessionSchema);

export { Session, validateSession };
