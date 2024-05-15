import mongoose from "mongoose";
import Joi from "joi";
import jpc from "joi-password-complexity";
import "dotenv/config";
import jwt from "jsonwebtoken";

const complexityOptions = {
  min: 4,
  max: 20,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
  requirementCount: 3,
};

const userSchema = new mongoose.Schema({
  name: { type: String, min: 2, max: 50, required: true },
  age: { type: Number, required: true },
  gender: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    min: 20,
    max: 150,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    validate: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Email not valid",
    ],
  },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { email: this.email, type: this.type },
    process.env.JWT_SECRET_KEY
  );
  return token;
};

const User = mongoose.model("User", userSchema);

const schema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  age: Joi.number().required(),
  gender: Joi.string().valid("Male", "Female", "Not Set"),
  type: Joi.string().valid("Student", "Teacher", "Moderator"),
  password: jpc(complexityOptions),
  email: Joi.string().email().required(),
});

const editSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  age: Joi.number().required(),
  gender: Joi.string().valid("Male", "Female", "Not Set"),
  type: Joi.string().valid("Student", "Teacher", "Moderator"),
  description: Joi.string().min(20).max(150),
  email: Joi.string().email().required(),
});

const validateEditUser = (newuUser) => {
  return editSchema.validate(newuUser);
};

const validateUser = (user) => {
  return schema.validate(user);
};

export { User, userSchema, validateUser, validateEditUser };
