import mongoose from "mongoose";
import validator from "validator";

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

const User = mongoose.model("User", UserSchema);

export default User;
