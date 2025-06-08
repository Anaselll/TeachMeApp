import mongoose from "mongoose";

const sessionSchema = mongoose.Schema(
  {
    offer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Offer",
      required: true,
    },
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tutor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["scheduled", "completed", "canceled"],
      default: "scheduled",
    },
  
    chat_active: {
      type: Boolean,
      default: false,
    },
    student_ready: {
      type: Boolean,
      default: false,
    },
    tutor_ready: {
      type: Boolean,
      default: false,
    },
    scheduled_start: {
      type: Date,
      required: true,
    },
    scheduled_end: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const Session=mongoose.model("Session",sessionSchema)
export default Session