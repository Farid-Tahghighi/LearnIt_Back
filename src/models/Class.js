import mongoose from "mongoose";
import { userSchema } from "./User.js";
import Joi from "joi";
import { subjectSchema } from "./Subject.js";
import joiObjectId from "joi-objectid";
Joi.objectId = joiObjectId(Joi);

const classSchema = new mongoose.Schema({
  subject: { type: subjectSchema, required: true },
  participants: [{ type: userSchema, required: true }],
  presenter: { type: userSchema, required: true },
  plan: [{ type: String }],
  startDate: { type: Date, required: true },
  finishDate: { type: Date },
  location: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, min: 30, max: 150 },
});

const schema = Joi.object({
  subjectTitle: Joi.string().required(),
  participantIds: Joi.array().items(Joi.objectId()).required(),
  presenterId: Joi.objectId().required(),
  plan: Joi.array().items(Joi.string()),
  startDate: Joi.date().required(),
  finishDate: Joi.date(),
  location: Joi.string().required(),
  category: Joi.string().required(),
  description: Joi.string().min(30).max(150),
});

const validateClass = (v) => {
  return schema.validate(v);
};

const Class = mongoose.model("Class", classSchema);

export { Class, validateClass };
