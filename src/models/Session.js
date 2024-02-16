import mongoose from "mongoose";
import { userSchema } from "./User";
import Joi from "joi";
import objectId from "joi-objectid";

const sessionSchema = new mongoose.Schema({
  duration: { type: Number, required: true, min: 45, max: 180 },
  present: [{ type: userSchema }],
  date: { type: Date, required: true },
});

const schema = Joi.object({
  duration: Joi.number().max(180).required(),
  present: Joi.array().items(Joi.objectId()).required(),
  date: Joi.date().required(),
});

const validateSession = async (v) => {
  return await schema.validateAsync(v);
};

const Session = mongoose.model("Session", sessionSchema);

export { Session, validateSession };
