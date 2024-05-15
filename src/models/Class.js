import mongoose from "mongoose";
import { userSchema } from "./User.js";
import Joi from "joi";
import { subjectSchema } from "./Subject.js";

const classSchema = new mongoose.Schema({
  subject: { type: subjectSchema, required: true },
  participants: [{ type: userSchema, required: true }],
  presenter: { type: userSchema, required: true },
  startDate: { type: Date, required: true },
  finishDate: { type: Date },
  location: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, min: 30, max: 150 },
});

const schema = Joi.object({
  subject: Joi.string().required(),
  participants: Joi.array().items(Joi.string().email()).required(),
  presenter: Joi.string().email().required(),
  startdate: Joi.date().required(),
  finishdate: Joi.date(),
  location: Joi.string().required(),
  category: Joi.string().required(),
  description: Joi.string().min(30).max(150),
});

const validateClass = (v) => {
  return schema.validate(v);
};

const Class = mongoose.model("Class", classSchema);

export { Class, validateClass };
