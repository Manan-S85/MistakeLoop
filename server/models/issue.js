import mongoose from "mongoose";

const issueSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  category: {
    type: String,
    required: true
  },

  weeksPersisted: {
    type: Number,
    default: 1
  },

  lastSeen: {
    type: Date,
    default: Date.now
  },

  resolved: {
    type: Boolean,
    default: false
  }
});

export default mongoose.model("Issue", issueSchema);
