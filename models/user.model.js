// ============================================================================
// User Model
// Defines the application's users, roles, and authentication data.
// ============================================================================

import mongoose from "mongoose";
import validator from "validator";
import { hash, genSalt, compare } from "bcrypt";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide name!"],
      trim: true,
      minlength: 3,
      maxlength: 50,
    },

    email: {
      type: String,
      required: [true, "Please provide email!"],
      trim: true,
      lowercase: true,
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: "Please provide a valid email!",
      },
    },

    password: {
      type: String,
      required: [true, "Please provide password!"],
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  {
    timestamps: true,
  },
);

// hash-password
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await genSalt(10);
  this.password = await hash(this.password, salt);
});

// compare-password
UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await compare(candidatePassword, this.password);
  return isMatch;
};

const User = mongoose.model("User", UserSchema);

export default User;
