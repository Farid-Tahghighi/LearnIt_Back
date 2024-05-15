import mongoose from "mongoose";
import Joi from "joi";

const subjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  credit: { type: Number, min: 1, max: 6, required: true },
  resource: { type: String },
});

const Subject = mongoose.model("Subject", subjectSchema);

const schema = Joi.object({
  title: Joi.string().min(3).required(),
  credit: Joi.number().valid(1, 3, 6).required(),
  resource: Joi.string().min(3).required(),
});

const validateSubject = (body) => {
  return schema.validate(body);
};

export { Subject, subjectSchema, validateSubject };
