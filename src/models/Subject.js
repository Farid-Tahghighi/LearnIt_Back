import mongoose from "mongoose";
import Joi from "joi";

const subjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  credit: { type: Number, min: 1, max: 6, required: true },
  resources: [{ type: String }],
});

const Subject = mongoose.model("Subject", subjectSchema);

const schema = Joi.object({
  title: Joi.string().min(1).required(),
  credit: Joi.number().valid(1, 3, 6).required(),
  resources: Joi.array().items(Joi.string()),
});

const validateSubject = async (body) => {
  return await schema.validateAsync(body);
};

export { Subject, subjectSchema, validateSubject };
