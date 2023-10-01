import { model, Schema } from "mongoose";

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    played: {
      type: Number,
      default: 0,
    },
    win: {
      type: Number,
      default: 0,
    },
    loss: {
      type: Number,
      default: 0,
    },
    draw: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const UserModel = model("User", UserSchema);
