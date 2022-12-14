const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const validator = require("validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// static signup method
userSchema.statics.signup = async function (email, password) {
  // validation
  if (!email || !password) {
    throw Error("All fields must be filled! :(");
  }
  if (!validator.isEmail(email)) {
    throw Error("Please enter a valid email! :(");
  }
  if (!validator.isStrongPassword(password)) {
    throw Error("Please enter a stronger password! :(");
  }

  const exists = await this.findOne({ email });

  if (exists) {
    throw Error("Email already in use! :(");
  }

  const salt = await bcryptjs.genSalt(10);
  const hash = await bcryptjs.hash(password, salt);

  const user = await this.create({ email, password: hash });

  return user;
};

// static login method
userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("All fields must be filled! :(");
  }

  const user = await this.findOne({ email });

  if (!user) {
    throw Error("User does not exist! :( Try signing up for a new account.");
  }

  const match = await bcryptjs.compare(password, user.password);

  if (!match) {
    throw Error("Password is incorrect! :( Make sure caps-lock is off.");
  }

  return user;
};

module.exports = mongoose.model("User", userSchema);
