import { model, Schema, Types } from "mongoose";

export type TBoard = {
  _id: Types.ObjectId;
  startedBy: Types.ObjectId;
  against: Types.ObjectId;
  numberOfPlayers: Number;
  key: string;
  grid: string[];
  currentMark: string;
  isGameOver: boolean;
  isDraw: boolean;
  hasWinner: boolean;
  winner: Types.ObjectId;
};

const BoardSchema = new Schema<TBoard>(
  {
    startedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
    grid: {
      type: [String],
      default: Array(9).fill(""),
    },
    currentMark: {
      type: String,
    },
    isGameOver: {
      type: Boolean,
    },
    isDraw: {
      type: Boolean,
    },
    hasWinner: {
      type: Boolean,
    },
    winner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const BoardModel = model<TBoard>("Board", BoardSchema);
