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
  plan: [{ type: String, required: true }],
  startTime: { type: Date, required: true },
  finishTime: { type: Date },
  location: { type: String, required: true },
});

const schema = Joi.object({
  subjectId: Joi.objectId().required(),
  participantIds: Joi.array().items(Joi.objectId()).required(),
  presenterId: Joi.objectId().required(),
  plan: Joi.array().items(Joi.string()).required(),
  startTime: Joi.date().required(),
  finishTime: Joi.date(),
  location: Joi.string().required(),
});

const validateClass = (v) => {
  return schema.validate(v);
};

const Class = mongoose.model("Class", classSchema);

export { Class, validateClass };
