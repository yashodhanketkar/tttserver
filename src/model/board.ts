import { model, Schema } from "mongoose";

export type TBoard = {
  _id: Schema.Types.ObjectId;
  startedBy: Schema.Types.ObjectId;
  against: Schema.Types.ObjectId;
  numberOfPlayers: Number;
  key: string;
  grid: string[];
  currentMark: string;
  isGameOver: boolean;
  isDraw: boolean;
  hasWinner: boolean;
  winner: Schema.Types.ObjectId;
};

const BoardSchema = new Schema<TBoard>(
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
  }
);

export const BoardModel = model<TBoard>("Board", BoardSchema);
