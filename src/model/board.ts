import { model, Schema } from "mongoose";

const BoardSchema = new Schema(
  {
    startedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    against: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    numberOfPlayers: {
      type: Number,
      default: 1,
    },
    key: {
      type: String,
    },
    grid: [
      {
        type: String,
      },
    ],
    currentMark: {
      type: String,
    },
    isDraw: {
      type: Boolean,
    },
    hasWinner: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

export const BoardModel = model("Board", BoardSchema);
